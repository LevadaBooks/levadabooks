'use server';

import * as yup from 'yup';
import { getT } from '@/locales';
import { fallbackLng } from '@/locales/settings';
import * as Sentry from '@sentry/nextjs';
import { Resend } from 'resend';
import { SubscribeTmpl, getSubscribeTmplTxt } from '@/components/shared/email-templates/SubscribeTmpl';
import client from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

type SubscribeFormState = {
    defaultValue: '';
    isValid: boolean;
    message: string;
};

if (typeof process.env.RESEND_API_KEY !== 'string') {
    throw new Error('RESEND_API_KEY is not defined');
}

if (typeof process.env.BASE_URL !== 'string') {
    throw new Error('BASE_URL is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const uid = uuidv4();

export async function subscribe(prevState: SubscribeFormState, formData: FormData) {
    const { t, i18n } = await getT('server');
    //const { email } = Object.fromEntries(formData);
    const email = formData.get('email')?.toString().trim();
    const lng = i18n.resolvedLanguage || fallbackLng;
    const schema = yup
        .string()
        .trim()
        .ensure()
        .email(() => t('src.components.shared.Subscribe.errors.regex'))
        .required(() => t('src.components.shared.Subscribe.errors.required'));

    try {
        await schema.validate(email);
    } catch (err) {
        return {
            ...prevState,
            isValid: false,
            defaultValue: (err as yup.ValidationError).value,
            message: (err as yup.ValidationError).message
        };
    }

    try {
        await client.connect();

        const db = client.db('website');

        const contact = await db.collection('contacts').findOne({ email });

        if (contact) {
            return {
                ...prevState,
                isValid: false,
                message: t('src.components.shared.Subscribe.errors.alreadySubscribed')
            };
        } else {
            const newContact = {
                email,
                uid,
                lng,
                isVerified: false,
                isSubscribed: false,
                createdAt: new Date()
            };

            const { insertedId } = await db.collection('contacts').insertOne(newContact);

            if (!insertedId) {
                return {
                    ...prevState,
                    isValid: false,
                    message: t('src.components.shared.Subscribe.errors.failedToSubscribe')
                };
            }

            try {
                const { error } = await resend.emails.send({
                    from: `LevadaBooks <registration@${process.env.BASE_URL}>`,
                    to: [email!],
                    subject: 'Confirm your subscription to LevadaBooks newsletter',
                    react: SubscribeTmpl({
                        url: `https://${process.env.BASE_URL}/${lng}/subscribe/${uid}`
                    }),
                    text: await getSubscribeTmplTxt({
                        url: `https://${process.env.BASE_URL}/${lng}/subscribe/${uid}`
                    })
                    /*headers: {
                        'List-Unsubscribe': `<https://${process.env.BASE_URL}/${lng}/unsubscribe/${uid}>`,
                        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
                    }*/
                });

                if (error) {
                    const { deletedCount } = await db.collection('contacts').deleteOne({ uid });

                    if (deletedCount === 0) {
                        Sentry.captureException(
                            new Error(
                                'Failed to remove user from database in "subscribe" action (email sending failed case 1)'
                            ),
                            {
                                extra: {
                                    uid
                                }
                            }
                        );
                    }

                    return {
                        ...prevState,
                        isValid: false,
                        message: t('src.components.shared.Subscribe.errors.failedToSendEmail')
                    };
                }

                return { ...prevState, isValid: true, message: t('src.components.shared.Subscribe.success') };
            } catch (error) {
                const { deletedCount } = await db.collection('contacts').deleteOne({ uid });

                if (deletedCount === 0) {
                    Sentry.captureException(error, {
                        extra: {
                            uid
                        }
                    });
                }

                return {
                    ...prevState,
                    isValid: false,
                    message: t('src.components.shared.Subscribe.errors.failedToSendEmail')
                };
            }
        }
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Failed to coonect to MongoDB in "subscribe" action'
            }
        });

        return { ...prevState, isValid: false, message: t('src.components.shared.Subscribe.errors.failedToConnect') };
    } finally {
        await client.close();
    }
}

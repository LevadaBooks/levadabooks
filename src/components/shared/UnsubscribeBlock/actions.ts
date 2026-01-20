'use server';

import * as yup from 'yup';
import { getT } from '@/locales';
import { Resend } from 'resend';
import client from '@/lib/mongodb';

type UnsubscribeFormState = {
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

export async function unsubscribe(prevState: UnsubscribeFormState, formData: FormData) {
    const { t } = await getT('server');
    const email = formData.get('email')?.toString().trim();
    const schema = yup
        .string()
        .trim()
        .ensure()
        .email(() => t('src.components.shared.Unsubscribe.errors.regex'))
        .required(() => t('src.components.shared.Unsubscribe.errors.required'));

    try {
        await schema.validate(email);
    } catch (err) {
        return { ...prevState, isValid: false, message: (err as yup.ValidationError).message };
    }

    try {
        await client.connect();

        const db = client.db('website');

        const user = await db.collection('contacts').findOne({ email });

        if (user) {
            const contact = await resend.contacts.update({
                email: email!,
                audienceId: process.env.RESEND_GENERAL_AUDIENCE_ID!,
                unsubscribed: true
            });

            if (!contact.data?.id) {
                return {
                    ...prevState,
                    isValid: false,
                    message: t('src.components.shared.Unsubscribe.errors.failedToUnsubscribe')
                };
            }

            const { modifiedCount } = await db
                .collection('contacts')
                .updateOne({ uid: user.uid }, { $set: { isSubscribed: false, updatedAt: new Date() } });

            if (modifiedCount === 0) {
                return {
                    ...prevState,
                    isValid: false,
                    message: t('src.components.shared.Unsubscribe.errors.failedToUnsubscribe')
                };
            }

            return {
                ...prevState,
                isValid: true,
                message: t('src.components.shared.Unsubscribe.success')
            };
        } else {
            return {
                ...prevState,
                isValid: false,
                message: t('src.components.shared.Unsubscribe.errors.userNotFound')
            };
        }
    } catch (error) {
        console.error('Failed to connect to MongoDB in "unsubscribe" action', error);

        return { ...prevState, isValid: false, message: t('src.components.shared.Unsubscribe.errors.failedToConnect') };
    } finally {
        await client.close();
    }
}

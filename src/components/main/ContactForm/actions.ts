'use server';

import * as yup from 'yup';
import { getT } from '@/locales';
import { FeedbackTmpl, getFeedbackTmplTxt } from '@/components/shared/email-templates/FeedbackTmpl';
import { Resend } from 'resend';

type ContactFormState = {
    //success: boolean;
    name: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
    email: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
    title: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
    message: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
    recaptchaToken: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
};

if (typeof process.env.RESEND_API_KEY !== 'string') {
    throw new Error('RESEND_API_KEY is not defined');
}

if (typeof process.env.RESEND_SEND_FROM_URL !== 'string') {
    throw new Error('RESEND_SEND_FROM_URL is not defined');
}

if (typeof process.env.RESEND_SEND_TO_URL !== 'string') {
    throw new Error('RESEND_SEND_TO_URL is not defined');
}

if (typeof process.env.GOOGLE_RECAPTCHA_PROJECT_ID !== 'string') {
    throw new Error('GOOGLE_RECAPTCHA_PROJECT_ID is not defined');
}

if (typeof process.env.GOOGLE_RECAPTCHA_API_KEY !== 'string') {
    throw new Error('GOOGLE_RECAPTCHA_API_KEY is not defined');
}

if (typeof process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY !== 'string') {
    throw new Error('NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const RECAPTCHA_USE_ENTERPRISE = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_USE_ENTERPRISE;

export async function submit(prevState: ContactFormState, formData: FormData) {
    const { i18n } = await getT('server');
    const { type, name, email, title, message, recaptchaToken } = Object.fromEntries(formData);
    const schema = yup.object({
        name: yup
            .string()
            .trim()
            .ensure()
            .required(() => i18n.t('src.components.main.ContactForm.errors.required')),
        email: yup
            .string()
            .trim()
            .ensure()
            .email(() => i18n.t('src.components.main.ContactForm.errors.regex'))
            .required(() => i18n.t('src.components.main.ContactForm.errors.required')),
        title: yup
            .string()
            .trim()
            .ensure()
            .required(() => i18n.t('src.components.main.ContactForm.errors.required')),
        message: yup
            .string()
            .trim()
            .ensure()
            .required(() => i18n.t('src.components.main.ContactForm.errors.required')),
        recaptchaToken: yup.lazy((value) => {
            const schema = yup
                .string()
                .trim()
                .ensure()
                .required(() => i18n.t('src.components.main.ContactForm.errors.recaptcha.required'));

            if (schema.isValidSync(value)) {
                return schema.test(
                    'recaptchaToken',
                    () => i18n.t('src.components.main.ContactForm.errors.recaptcha.notValid'),
                    async (recaptchaToken, ctx) => {
                        const url = RECAPTCHA_USE_ENTERPRISE
                            ? `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.GOOGLE_RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.GOOGLE_RECAPTCHA_API_KEY}`
                            : `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
                        const recaptchaResponse = await fetch(url, {
                            method: 'POST',
                            body: JSON.stringify({
                                event: {
                                    token: recaptchaToken,
                                    expectedAction: 'contact',
                                    siteKey: process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY
                                }
                            })
                        });
                        const data = await recaptchaResponse.json();

                        if (RECAPTCHA_USE_ENTERPRISE) {
                            if (!data?.tokenProperties?.valid || data?.riskAnalysis?.score < 0.5) {
                                return ctx.createError({
                                    message: i18n.t('src.components.main.ContactForm.errors.recaptcha.notValid')
                                });
                            }
                        } else {
                            if (!data?.success || data?.score < 0.5) {
                                return ctx.createError({
                                    message: i18n.t('src.components.main.ContactForm.errors.recaptcha.notValid')
                                });
                            }
                        }

                        return true;
                    }
                );
            }

            return schema;
        })
    });

    try {
        await schema.validate({ name, email, title, message, recaptchaToken }, { abortEarly: false });
    } catch (err) {
        const errors: Partial<ContactFormState> = {};

        for (const key in (err as yup.ValidationError).value) {
            errors[key as keyof ContactFormState] = {
                defaultValue: String((err as yup.ValidationError).value[key] ?? ''),
                isValid: !(err as yup.ValidationError).inner.some((error) => error.path === key),
                message: (err as yup.ValidationError).inner.find((error) => error.path === key)?.message || ''
            };
        }

        return {
            ...prevState,
            ...errors,
            success: false
        };
    }

    try {
        const { error } = await resend.emails.send({
            from: `Website Feedback<no_reply@${process.env.RESEND_SEND_FROM_URL}>`,
            to: [`feedback@${process.env.RESEND_SEND_TO_URL}`],
            subject: title.toString(),
            react: FeedbackTmpl({
                type: type.toString(),
                name: name.toString(),
                email: email.toString(),
                message: message.toString()
            }),
            text: await getFeedbackTmplTxt({
                type: type.toString(),
                name: name.toString(),
                email: email.toString(),
                message: message.toString()
            })
        });

        if (error) {
            return {
                ...prevState,
                success: false
            };
        }

        return { ...prevState, success: true };
    } catch (error) {
        console.error('Error sending email from Resend in "ContactForm" component', error);

        return {
            ...prevState,
            success: false
        };
    }
}

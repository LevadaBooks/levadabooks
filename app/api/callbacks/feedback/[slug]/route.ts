import * as yup from 'yup';
import { Resend } from 'resend';
import { getT } from '@/locales';
import { NextRequest, NextResponse } from 'next/server';
import { FeedbackTmpl, getFeedbackTmplTxt } from '@/components/shared/email-templates/FeedbackTmpl';

type PostParamsType = {
    name: string;
    email: string;
    message: string;
};

type GetParamsType = {
    slug: string;
};

type FeedbackFormState = {
    name: {
        isValid: boolean;
        message: string;
    };
    email: {
        isValid: boolean;
        message: string;
    };
    message: {
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

const resend = new Resend(process.env.RESEND_API_KEY);

const POST = async (request: NextRequest, context: RouteContext<'/api/callbacks/feedback/[slug]'>) => {
    const { name, email, message }: PostParamsType = await request.json();
    const { slug } = await context.params;
    const { i18n } = await getT('server');
    const schema = yup.object({
        name: yup
            .string()
            .trim()
            .ensure()
            .required(() => i18n.t('src.components.main.Feedback.index.errors.name.required')),
        email: yup
            .string()
            .trim()
            .ensure()
            .email(() => i18n.t('src.components.main.Feedback.index.errors.email.regex'))
            .required(() => i18n.t('src.components.main.Feedback.index.errors.email.required')),
        message: yup
            .string()
            .trim()
            .ensure()
            .required(() => i18n.t('src.components.main.Feedback.index.errors.message.required'))
    });
    const response: Partial<FeedbackFormState> = {
        name: { isValid: true, message: '' },
        email: { isValid: true, message: '' },
        message: { isValid: true, message: '' }
    };

    try {
        await schema.validate({ name, email, message });
    } catch (err) {
        for (const key in (err as yup.ValidationError).value) {
            const message = (err as yup.ValidationError).errors.find((error) => error.includes(key)) || '';

            response[key as keyof FeedbackFormState] = {
                isValid: !message,
                message
            };
        }

        return NextResponse.json(response, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    try {
        const { error } = await resend.emails.send({
            from: `InApp Feedback<no_reply@${process.env.RESEND_SEND_FROM_URL}>`,
            to: [`feedback@${process.env.RESEND_SEND_TO_URL}`],
            subject: i18n.t('feedback.type.app', { slug }),
            react: FeedbackTmpl({
                type: 'private',
                email: email.toString(),
                name: name.toString(),
                message: message.toString()
            }),
            text: await getFeedbackTmplTxt({
                type: 'private',
                email: email.toString(),
                name: name.toString(),
                message: message.toString()
            })
        });

        if (error) {
            console.error(`Error sending email from Resend in app "${slug}" feedback form`, error);
        }
    } catch (error) {
        console.error(`Error sending email from Resend in app "${slug}" feedback form`, error);
    }

    return NextResponse.json(response, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
};

export { POST };

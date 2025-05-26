'use server';

import { getT } from '@/locales';
import client from '@/lib/mongodb';
import * as Sentry from '@sentry/nextjs';
import { Resend } from 'resend';

if (typeof process.env.RESEND_API_KEY !== 'string') {
    throw new Error('RESEND_API_KEY is not defined');
}

if (typeof process.env.RESEND_GENERAL_AUDIENCE_ID !== 'string') {
    throw new Error('RESEND_GENERAL_AUDIENCE_ID is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function confirmSubscription(uid: string) {
    const { t } = await getT('server');

    if (!uid) {
        return { error: t('Invalid subscription link.'), data: null };
    }

    try {
        await client.connect();

        const db = client.db('website');

        const user = await db.collection('contacts').findOne({ uid });

        if (!user) {
            return { error: t('Invalid subscription link.'), data: null }; // or subscription link has been expired
        }

        if (user.isVerified) {
            return { error: t('Subscription already confirmed.'), data: null };
        }

        const { modifiedCount } = await db
            .collection('contacts')
            .updateOne({ uid }, { $set: { isVerified: true, isSubscribed: true, updatedAt: new Date() } });

        if (modifiedCount > 0) {
            const contact = await resend.contacts.create({
                email: user.email,
                audienceId: process.env.RESEND_GENERAL_AUDIENCE_ID!
            });

            if (!contact.data?.id) {
                return { error: t('Unable to add contact to Resend audience.'), data: null };
            }

            return { error: null, data: { message: t('Subscription confirmed successfully.') } };
        }

        return { error: t('Unable to confirm subscription.'), data: null };
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Failed to connect to MongoDB in "confirmSubscription" action'
            }
        });

        return { error: t('Error conection to database.'), data: null };
    }
}

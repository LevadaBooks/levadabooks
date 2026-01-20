import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { Resend } from 'resend';

if (!process.env.CRON_SECRET) {
    throw new Error('CRON_SECRET is not defined');
}

if (typeof process.env.RESEND_API_KEY !== 'string') {
    throw new Error('RESEND_API_KEY is not defined');
}

if (typeof process.env.RESEND_GENERAL_AUDIENCE_ID !== 'string') {
    throw new Error('RESEND_GENERAL_AUDIENCE_ID is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', {
            status: 401
        });
    }

    try {
        await client.connect();

        const db = client.db('website');

        const { data, error } = await resend.contacts.list({
            audienceId: process.env.RESEND_GENERAL_AUDIENCE_ID!
        });

        if (!data?.data) {
            console.error('Failed to get contacts from Resend', error);
        }

        const unsubscribedContacts = data?.data
            .filter((contact) => contact.unsubscribed)
            .map((contact) => contact.email);

        if (!unsubscribedContacts || unsubscribedContacts.length === 0) {
            return NextResponse.json(null);
        }

        try {
            await db.collection('contacts').updateMany(
                {
                    email: {
                        $in: unsubscribedContacts
                    }
                },
                { $set: { isSubscribed: false, updatedAt: new Date() } }
            );
        } catch (error) {
            console.error('Failed to update unsubscribed contacts in MongoDB', error);
        }
    } catch (error) {
        console.error('Failed to connect to MongoDB in "unsubscribed-contacts" cron job', error);
    } finally {
        await client.close();
    }

    return NextResponse.json(null);
}

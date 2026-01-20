import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import client from '@/lib/mongodb';

type EmailType =
    | 'contact.created'
    | 'contact.deleted'
    | 'contact.updated'
    | 'domain.created'
    | 'domain.deleted'
    | 'domain.updated'
    | 'email.bounced'
    | 'email.clicked'
    | 'email.complained'
    | 'email.delivered'
    | 'email.delivery_delayed'
    | 'email.failed'
    | 'email.opened'
    | 'email.sent';

type WebhookEvent = {
    created_at: string;
    data: {
        created_at: string;
        email_id: string;
        from: string;
        subject: string;
        to: string[];
    };
    type: EmailType;
};

if (!process.env.RESEND_WEBHOOK_SECRET) {
    throw new Error('RESEND_WEBHOOK_SECRET is not defined');
}

export async function POST(req: NextRequest) {
    const svix_id = req.headers.get('svix-id') ?? '';
    const svix_timestamp = req.headers.get('svix-timestamp') ?? '';
    const svix_signature = req.headers.get('svix-signature') ?? '';
    const body = await req.text();
    const sivx = new Webhook(process.env.RESEND_WEBHOOK_SECRET!);
    let event;

    try {
        event = sivx.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature
        }) as WebhookEvent;
    } catch (error) {
        console.error('Error verifying Resend webhook signature:', error);

        return new NextResponse(null, { status: 400 });
    }

    if (['email.bounced', 'email.complained'].includes(event.type)) {
        try {
            await client.connect();

            const db = client.db('website');

            try {
                await db.collection('contacts').deleteOne({
                    email: event.data.to[0]
                });
            } catch (error) {
                console.error('Remove subsccribers error in "resend" webhook', error);
            }
        } catch (error) {
            console.error('Failed to connect to MongoDB in "resend" webhook', error);
        } finally {
            await client.close();
        }
    }

    return new NextResponse(null, { status: 200 });
}

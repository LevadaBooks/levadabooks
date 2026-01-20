import { permanentRedirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import client from '@/lib/mongodb';
import { Resend } from 'resend';
import { getT } from '@/locales';

if (typeof process.env.RESEND_API_KEY !== 'string') {
    throw new Error('RESEND_API_KEY is not defined');
}

if (typeof process.env.RESEND_GENERAL_AUDIENCE_ID !== 'string') {
    throw new Error('RESEND_GENERAL_AUDIENCE_ID is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
    const { i18n } = await getT('server');

    permanentRedirect(`/${i18n.resolvedLanguage}/unsubscribe`);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;

    if (!uid) {
        console.error('Invalid request: missing uid');

        return new NextResponse(null, { status: 200 });
    }

    try {
        await client.connect();

        const db = client.db('website');
        const user = await db.collection('contacts').findOne({ uid });

        if (!user) {
            console.error('User not found', { uid });
        }

        const contact = await resend.contacts.update({
            email: user?.email,
            audienceId: process.env.RESEND_GENERAL_AUDIENCE_ID!,
            unsubscribed: true
        });

        if (!contact.data?.id) {
            console.error('Failed to unsubscribe contact from Resend audience', { email: user?.email });
        }

        const { modifiedCount } = await db
            .collection('contacts')
            .updateOne({ uid }, { $set: { isSubscribed: false, updatedAt: new Date() } });

        if (modifiedCount === 0) {
            console.error('Failed to remove user from database', { uid });
        }
    } catch (error) {
        console.error('DB error', error);

        return new NextResponse(null, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
}

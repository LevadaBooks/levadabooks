import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import client from '@/lib/mongodb';
import dayjs from 'dayjs';

if (!process.env.CRON_SECRET) {
    throw new Error('CRON_SECRET is not defined');
}

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

        try {
            await db.collection('contacts').deleteMany({
                isVerified: false,
                createdAt: {
                    $lt: dayjs().subtract(1, 'day').toDate()
                }
            });
        } catch (error) {
            Sentry.captureException(error, {
                extra: {
                    message: 'Failed to remove unverified subscribers from MongoDB'
                }
            });
        }
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Failed to connect to MongoDB in "unverified-subscribers" cron job'
            }
        });
    } finally {
        await client.close();
    }

    return NextResponse.json(null);
}

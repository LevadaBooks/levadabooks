import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

class SentryExampleAPIError extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = 'SentryExampleAPIError';
    }
}
const GET = () => {
    throw new SentryExampleAPIError('This error is raised on the backend called by the example page.');

    return NextResponse.json({ data: 'Testing Sentry Error...' });
};

export { GET };

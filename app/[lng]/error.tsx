'use client';

import * as Sentry from '@sentry/nextjs';
import { useCallback, useEffect } from 'react';
import ErrorBlock from '@/components/shared/Error';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
    const onClick = useCallback(() => reset(), [reset]);

    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return <ErrorBlock onClick={onClick} />;
}

Error.displayName = 'Error';

export default Error;

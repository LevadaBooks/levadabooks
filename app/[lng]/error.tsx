'use client';

import { useCallback, useEffect } from 'react';
import ErrorBlock from '@/components/shared/Error';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
    const onClick = useCallback(() => reset(), [reset]);

    useEffect(() => {
        console.error('Error:', error);
    }, [error]);

    return <ErrorBlock onClick={onClick} />;
}

Error.displayName = 'Error';

export default Error;

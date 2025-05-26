import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';
import { fallbackLng } from '@/locales/settings';

type LinkBaseProps = {
    lng?: string;
    children: ReactNode;
};

const LinkBase = ({ lng = fallbackLng, href = '', children, ...props }: LinkBaseProps & LinkProps) => (
    <Link href={`/${lng}${href}`} {...props}>
        {children}
    </Link>
);

LinkBase.displayName = 'LinkBase';

export default LinkBase;

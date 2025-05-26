'use client';

import LinkBase from '@/components/shared/Link/LinkBase';
import { useT } from '@/locales/client';
import { LinkProps } from 'next/link';
import { memo } from 'react';

type LinkPropsType = {
    href?: string;
    children?: React.ReactNode;
};

const Link = memo(({ href, children, ...props }: LinkPropsType & LinkProps) => {
    const { i18n } = useT();

    return (
        <LinkBase lng={i18n.resolvedLanguage} href={href} {...props}>
            {children}
        </LinkBase>
    );
});

Link.displayName = 'Link';

export default Link;
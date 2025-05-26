import React from 'react';
import { getT } from '@/locales';
import LinkBase from '@/components/shared/Link/LinkBase';
import { LinkProps } from 'next/link';

type LinkPropsType = {
    lng?: string;
    children?: React.ReactNode;
};

const Link = async ({ href, children, ...props }: LinkPropsType & LinkProps) => {
    const { i18n } = await getT();

    return (
        <LinkBase lng={i18n.resolvedLanguage} href={href} {...props}>
            {children}
        </LinkBase>
    );
};

Link.displayName = 'Link';

export default Link;
import { FC } from 'react';
//import Script from 'next/script';
//import { headers } from 'next/headers';

type JsonLdPropsType = {
    id: string;
    schema: unknown;
};

const JsonLd: FC<JsonLdPropsType> = async ({ id, schema }) => {
    //const nonce = (await headers()).get('x-nonce') || '';
    //nonce={nonce}
    return (
        <script
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema).replace(/</g, '\\u003c')
            }}
        />
    );
};

JsonLd.displayName = 'JsonLd';

export default JsonLd;

import { getT } from '@/locales';
import { languages } from '@/locales/settings';
import type { Metadata, ResolvingMetadata } from 'next';
import CookiePolicyPage from '@/components/main/pages/CookiePolicyPage';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

type MetadataProps = {
    params: Promise<{ lng: string }>;
};

export async function generateStaticParams() {
    return languages.map((lng) => ({ lng }));
}

export async function generateMetadata(props: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
    const { t } = await getT('server');
    const { lng } = await props.params;
    const parentURL = (await parent).openGraph?.url || `https://${process.env.BASE_URL}/${lng}`;

    return {
        title: t('CookiePolicy'),
        description: t('CookiePolicyDescription'),
        keywords: t('CookiePolicyKeywords'), // ['Next.js', 'React', 'JavaScript']
        formatDetection: {
            email: true,
            address: false,
            telephone: false
        },
        alternates: {
            canonical: `/${lng}/cookie-policy`,
            languages: languages
                .reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `/${curr}/cookie-policy`;

                    return acc;
                }, {})
        },
        openGraph: {
            url: `${parentURL}/cookie-policy`
        }
    };
}

const Page = () => <CookiePolicyPage />;

Page.displayName = 'Page';

export default Page;

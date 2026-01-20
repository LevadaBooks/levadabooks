import { getT } from '@/locales';
import { languages } from '@/locales/settings';
import type { Metadata, ResolvingMetadata } from 'next';
import PrivacyPolicyPage from '@/components/main/pages/PrivacyPolicyPage';

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
        title: t('PrivacyPolicy'),
        description: t('PrivacyPolicyDescription'),
        keywords: t('PrivacyPolicyKeywords'), // ['Next.js', 'React', 'JavaScript']
        formatDetection: {
            email: true,
            address: false,
            telephone: false
        },
        alternates: {
            canonical: `/${lng}/privacy-policy`,
            languages: languages
                .reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `/${curr}/privacy-policy`;

                    return acc;
                }, {})
        },
        openGraph: {
            url: `${parentURL}/privacy-policy`
        }
    };
}

const Page = () => <PrivacyPolicyPage />;

Page.displayName = 'Page';

export default Page;

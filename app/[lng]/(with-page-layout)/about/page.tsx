import { getT } from '@/locales';
import { languages } from '@/locales/settings';
import type { Metadata, ResolvingMetadata } from 'next';
import AboutPage from '@/components/main/pages/AboutPage';

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
        title: t('About'),
        description: t('AboutDescription'),
        keywords: t('AboutKeywords'), // ['Next.js', 'React', 'JavaScript']
        formatDetection: {
            email: false,
            address: false,
            telephone: false
        },
        alternates: {
            canonical: `/${lng}/about`,
            languages: languages
                .reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `/${curr}/about`;

                    return acc;
                }, {})
        },
        openGraph: {
            url: `${parentURL}/about`
        }
    };
}

const Page = () => <AboutPage />;

Page.displayName = 'AboutPage';

export default Page;

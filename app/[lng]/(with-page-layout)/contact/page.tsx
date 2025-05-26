import { getT } from '@/locales';
import { languages } from '@/locales/settings';
import type { Metadata, ResolvingMetadata } from 'next';
import ContactPage from '@/components/main/pages/ContactPage';

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
        title: t('Contact'),
        description: t('ContactDescription'),
        keywords: t('ContactKeywords'), // ['Next.js', 'React', 'JavaScript']
        formatDetection: {
            email: false,
            address: false,
            telephone: false
        },
        alternates: {
            canonical: `/${lng}/contact`,
            languages: languages
                .reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `/${curr}/contact`;

                    return acc;
                }, {})
        },
        openGraph: {
            url: `${parentURL}/contact`
        }
    };
}

const Page = () => <ContactPage />;

Page.displayName = 'Page';

export default Page;

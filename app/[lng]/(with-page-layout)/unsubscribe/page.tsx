import { getT } from '@/locales';
import { languages } from '@/locales/settings';
import type { Metadata, ResolvingMetadata } from 'next';
import UnsubscribePage from '@/components/main/pages/UnsubscribePage';

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
        title: t('Unsubscribe'),
        description: t('UnsubscribeDescription'),
        keywords: t('UnsubscribeKeywords'), // ['Next.js', 'React', 'JavaScript']
        formatDetection: {
            email: true,
            address: false,
            telephone: false
        },
        alternates: {
            canonical: `/${lng}/unsubscribe`,
            languages: languages
                .reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `/${curr}/unsubscribe`;

                    return acc;
                }, {})
        },
        openGraph: {
            url: `${parentURL}/unsubscribe`
        }
    };
}

const Page = () => <UnsubscribePage />;

Page.displayName = 'Page';

export default Page;

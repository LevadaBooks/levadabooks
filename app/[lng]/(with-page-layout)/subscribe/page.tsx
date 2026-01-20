import { getT } from '@/locales';
import { languages } from '@/locales/settings';
import type { Metadata, ResolvingMetadata } from 'next';
import SubscribePage from '@/components/main/pages/SubscribePage';

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
        title: t('Subscribe'),
        description: t('SubscribeDescription'),
        keywords: t('SubscribeKeywords'), // ['Next.js', 'React', 'JavaScript']
        formatDetection: {
            email: false,
            address: false,
            telephone: false
        },
        alternates: {
            canonical: `/${lng}/subscribe`,
            languages: languages
                .reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `/${curr}/subscribe`;

                    return acc;
                }, {})
        },
        openGraph: {
            url: `${parentURL}/subscribe`
        }
    };
}

const Page = async ({ params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = await params;

    return <SubscribePage uid={uid} />;
};

Page.displayName = 'Page';

export default Page;

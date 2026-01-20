import { languages } from '@/locales/settings';
import type { Viewport, Metadata } from 'next';
import RootLayout from '@/components/shared/layouts/RootLayout';
import { getT } from '@/locales';

type MetadataProps = {
    params: Promise<{ lng: string }>;
};

type LayoutProps = {
    children: React.ReactNode;
    params: Promise<{ lng: string }>;
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1
};

export async function generateMetadata(props: MetadataProps): Promise<Metadata> {
    const { t } = await getT('server');
    const { lng } = await props.params;

    return {
        title: {
            template: `%s | ${t('LevadaBooks')}`,
            default: t('LevadaBooks')
        },
        generator: 'Next.js',
        applicationName: t('LevadaBooks'),
        referrer: 'origin-when-cross-origin',
        authors: [{ name: t('LevadaBooks'), url: `https://${process.env.BASE_URL}` }],
        creator: t('LevadaBooks'),
        publisher: t('LevadaBooks'),
        robots: { index: true, follow: true, "max-image-preview": 'large', "max-snippet": -1, "max-video-preview": -1 },
        metadataBase: new URL(`https://${process.env.BASE_URL}`),
        openGraph: {
            url: `https://${process.env.BASE_URL}/${lng}`,
            siteName: 'LevadaBooks',
            locale: lng,
            type: 'website'
        }
    };
}

export async function generateStaticParams() {
    return languages.map((lng) => ({ lng }));
}

const Layout = async ({ children, params }: LayoutProps) => {
    const { lng } = await params;

    return <RootLayout lng={lng}>{children}</RootLayout>;
};

Layout.displayName = 'Layout';

export default Layout;

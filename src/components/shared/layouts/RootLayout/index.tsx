import '@/styles/global.css';
import { dir } from 'i18next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import JsonLd from '@/components/shared/JsonLd';
import { WebSite, WithContext } from 'schema-dts';
import { getT } from '@/locales';
import { theme, roboto } from '@/theme';

type LayoutProps = {
    children: React.ReactNode;
    lng: string;
};

const RootLayout = async ({ children, lng }: LayoutProps) => {
    const { t, i18n } = await getT('server');
    const webSiteSchema: WithContext<WebSite> = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: t('LevadaBooks'),
        image: 'https://nextjs.org/imgs/sticker.png',
        description: t('LevadaBooksDescription'),
        inLanguage: i18n.resolvedLanguage,
        url: `https://${process.env.BASE_URL}`
    };

    return (
        <html lang={lng} dir={dir(lng)} className={roboto.variable} suppressHydrationWarning>
            <body>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {children}
                        <JsonLd id="RootLayout-ld+json" schema={webSiteSchema} />
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
};

RootLayout.displayName = 'RootLayout';

export default RootLayout;

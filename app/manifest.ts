import type { MetadataRoute } from 'next';
import { getT } from '@/locales';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const { t } = await getT('server');

    return {
        name: t('LevadaBooks'),
        short_name: t('LevadaBooks'),
        description: t('LevadaBooks description'),
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon'
            }
        ]
    };
}

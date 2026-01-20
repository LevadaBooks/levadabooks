import type { MetadataRoute } from 'next';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/']
        },
        sitemap: `https://${process.env.BASE_URL}/sitemap.xml`
    };
}

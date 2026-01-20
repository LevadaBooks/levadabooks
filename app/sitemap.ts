import type { MetadataRoute } from 'next';
import { languages } from '@/locales/settings';
import { BOOK } from '@/enums';
//import { getT } from '@/locales';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    //const { t } = await getT('server');

    return [
        ...(languages.map((lng) => ({
            url: `https://${process.env.BASE_URL}/${lng}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0,
            alternates: {
                languages: languages.reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `https://${process.env.BASE_URL}/${curr}`;

                    return acc;
                }, {})
            }
        })) as MetadataRoute.Sitemap),
        ...(languages.map((lng) => ({
            url: `https://${process.env.BASE_URL}/${lng}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
            alternates: {
                languages: languages.reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `https://${process.env.BASE_URL}/${curr}/about`;

                    return acc;
                }, {})
            }
            //images: [`https://${process.env.BASE_URL}/assets/images/profile.jpg`]
        })) as MetadataRoute.Sitemap),
        ...(languages.map((lng) => ({
            url: `https://${process.env.BASE_URL}/${lng}/books`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
            alternates: {
                languages: languages.reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `https://${process.env.BASE_URL}/${curr}/books`;

                    return acc;
                }, {})
            }
        })) as MetadataRoute.Sitemap),
        ...(languages.map((lng) => ({
            url: `https://${process.env.BASE_URL}/${lng}/book/${BOOK.LITTLE_PRINCE}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
            alternates: {
                languages: languages.reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `https://${process.env.BASE_URL}/${curr}/book/${BOOK.LITTLE_PRINCE}`;

                    return acc;
                }, {})
            }
        })) as MetadataRoute.Sitemap),
        ...(languages.map((lng) => ({
            url: `https://${process.env.BASE_URL}/${lng}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
            alternates: {
                languages: languages.reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `https://${process.env.BASE_URL}/${curr}/contact`;

                    return acc;
                }, {})
            }
            /*images: [`https://${process.env.BASE_URL}/assets/images/profile.jpg`],
            videos: [ // https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
                {
                    title: t('Video Title'),
                    thumbnail_loc: `https://${process.env.BASE_URL}/assets/images/profile.jpg`,
                    description: t('Video Description'),
                    content_loc: `https://${process.env.BASE_URL}/assets/videos/sample.mp4`,
                    player_loc: `https://${process.env.BASE_URL}/watch?v=12345`,
                    duration: 600,
                    expiration_date: new Date().toISOString(),
                    rating: 5,
                    view_count: 1000,
                    publication_date: new Date().toISOString(),
                    family_friendly: 'yes',
                    restriction: {
                        relationship: 'allow',
                        content: ''
                    },
                    platform: {
                        relationship: 'allow',
                        content: 'https://www.youtube.com'
                    },
                    requires_subscription: 'no',
                    uploader: {
                        info: 'Uploader Info',
                        content: `https://${process.env.BASE_URL}/uploader`
                    },
                    live: 'no',
                    tag: 'tag1'
                    
                }
            ]*/
        })) as MetadataRoute.Sitemap),
        ...(languages.map((lng) => ({
            url: `https://${process.env.BASE_URL}/${lng}/cookie-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
            alternates: {
                languages: languages.reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `https://${process.env.BASE_URL}/${curr}/cookie-policy`;

                    return acc;
                }, {})
            }
        })) as MetadataRoute.Sitemap),
        ...(languages.map((lng) => ({
            url: `https://${process.env.BASE_URL}/${lng}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
            alternates: {
                languages: languages.reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `https://${process.env.BASE_URL}/${curr}/faq`;

                    return acc;
                }, {})
            }
        })) as MetadataRoute.Sitemap),
        ...(languages.map((lng) => ({
            url: `https://${process.env.BASE_URL}/${lng}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
            alternates: {
                languages: languages.reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `https://${process.env.BASE_URL}/${curr}/privacy-policy`;

                    return acc;
                }, {})
            }
        })) as MetadataRoute.Sitemap),
        ...(languages.map((lng) => ({
            url: `https://${process.env.BASE_URL}/${lng}/terms-of-use`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
            alternates: {
                languages: languages.reduce<Record<string, string>>((acc, curr) => {
                    acc[curr] = `https://${process.env.BASE_URL}/${curr}/terms-of-use`;

                    return acc;
                }, {})
            }
        })) as MetadataRoute.Sitemap)
    ];
}

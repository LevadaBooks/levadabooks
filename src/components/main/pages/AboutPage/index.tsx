import Image from 'next/image';
import { getT } from '@/locales';
import JsonLd from '@/components/shared/JsonLd';
import { AboutPage as AboutPageSchema, BreadcrumbList, WithContext } from 'schema-dts';
import styles from './styles.module.scss';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

const AboutPage = async () => {
    const { i18n, t } = await getT('server');
    const breadcrumbListSchema: WithContext<BreadcrumbList> = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: t('HomeTitle'),
                item: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}`
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: t('AboutTitle')
            }
        ]
    };
    const aboutPageSchema: WithContext<AboutPageSchema> = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: t('AboutTitle'),
        image: 'https://nextjs.org/imgs/sticker.png',
        description: t('AboutDescription'),
        inLanguage: i18n.resolvedLanguage,
        url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/about`
    };

    return (
        <div className={styles.pageCont}>
            <JsonLd id="AboutPage-ld+json" schema={[breadcrumbListSchema, aboutPageSchema]} />
            <Image
                src="/assets/images/profile.jpg"
                alt="Profile"
                width={100}
                height={100}
                priority
                fetchPriority="high"
            />
        </div>
    );
};

AboutPage.displayName = 'AboutPage';

export default AboutPage;

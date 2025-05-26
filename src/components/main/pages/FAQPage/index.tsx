import Image from 'next/image';
import { getT } from '@/locales';
import JsonLd from '@/components/shared/JsonLd';
import { FAQPage as FAQPageSchema, BreadcrumbList, WithContext } from 'schema-dts';
import styles from './styles.module.scss';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

const FAQPage = async () => {
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
                name: t('FAQTitle')
            }
        ]
    };
    const faqPageSchema: WithContext<FAQPageSchema> = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: t('FAQTitle'),
        image: 'https://nextjs.org/imgs/sticker.png',
        description: t('FAQDescription'),
        inLanguage: i18n.resolvedLanguage,
        url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/faq`
    };

    return (
        <div className={styles.pageCont}>
            <JsonLd id="FAQPage-ld+json" schema={[breadcrumbListSchema, faqPageSchema]} />
            <Image src="/assets/images/profile.jpg" alt="Profile" width={100} height={100} priority fetchPriority="high" />
        </div>
    );
};

FAQPage.displayName = 'FAQPage';

export default FAQPage;

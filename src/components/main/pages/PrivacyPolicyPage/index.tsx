import { getT } from '@/locales';
import JsonLd from '@/components/shared/JsonLd';
import { WebPage, BreadcrumbList, WithContext } from 'schema-dts';
import styles from './styles.module.scss';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

const PrivacyPolicyPage = async () => {
    const { t, i18n } = await getT('server');
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
                name: t('PrivacyPolicyTitle')
            }
        ]
    };
    const webPageSchema: WithContext<WebPage> = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t('PrivacyPolicyTitle'),
        image: 'https://nextjs.org/imgs/sticker.png',
        description: t('PrivacyPolicyDescription'),
        inLanguage: i18n.resolvedLanguage,
        url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/privacy-policy`
    };

    return (
        <div className={styles.pageCont}>
            <iframe src={`/${i18n.resolvedLanguage}/privacy-policy.html`} />
            <JsonLd id="PrivacyPolicyPage-ld+json" schema={[breadcrumbListSchema, webPageSchema]} />
        </div>
    );
};

PrivacyPolicyPage.displayName = 'PrivacyPolicyPage';

export default PrivacyPolicyPage;

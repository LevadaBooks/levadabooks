import { getT } from '@/locales';
import JsonLd from '@/components/shared/JsonLd';
import { WebPage, BreadcrumbList, WithContext } from 'schema-dts';
import UnsubscribeBlock from '@/components/shared/UnsubscribeBlock';
import styles from './styles.module.scss';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

const UnsubscribePage = async () => {
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
                name: t('UnsubscribeTitle')
            }
        ]
    };
    const webPageSchema: WithContext<WebPage> = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t('UnsubscribeTitle'),
        image: 'https://nextjs.org/imgs/sticker.png',
        description: t('UnsubscribeDescription'),
        inLanguage: i18n.resolvedLanguage,
        url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/unsubscribe`
    };

    return (
        <div className={styles.pageCont}>
            <UnsubscribeBlock />
            <JsonLd id="UnsubscribePage-ld+json" schema={[breadcrumbListSchema, webPageSchema]} />
        </div>
    );
};

UnsubscribePage.displayName = 'UnsubscribePage';

export default UnsubscribePage;

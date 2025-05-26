import Link from '@/components/shared/Link';
import { getT } from '@/locales';
import JsonLd from '@/components/shared/JsonLd';
import { WebPage, BreadcrumbList, WithContext } from 'schema-dts';
import { confirmSubscription } from './actions';
import styles from './styles.module.scss';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

type SubscribePageProps = {
    uid: string;
};

const SubscribePage = async ({ uid }: SubscribePageProps) => {
    const { t, i18n } = await getT('server');
    const { error, data } = await confirmSubscription(uid);
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
                name: t('SubscribeTitle')
            }
        ]
    };
    const webPageSchema: WithContext<WebPage> = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t('SubscribeTitle'),
        image: 'https://nextjs.org/imgs/sticker.png',
        description: t('SubscribeDescription'),
        inLanguage: i18n.resolvedLanguage,
        url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/subscribe`
    };

    return (
        <div className={styles.pageCont}>
            <JsonLd id="SubscribePage-ld+json" schema={[breadcrumbListSchema, webPageSchema]} />
            {
                error ? (
                    <h1 className={styles.pageHeader}>{error}</h1>
                ) : (
                    <h1 className={styles.pageHeader}>{t('src.components.main.pages.Subscribe.success.confirmed')}</h1>
                )
            }
            {
                data && (
                    <p className={styles.pageText}>
                        {data.message}
                    </p>
                )
            }
            {
                !error && (
                    <Link href="/">
                        {t('src.components.main.pages.Subscribe.success.backToHome')}
                    </Link>
                )
            }
        </div>
    );
};

SubscribePage.displayName = 'SubscribePage';

export default SubscribePage;

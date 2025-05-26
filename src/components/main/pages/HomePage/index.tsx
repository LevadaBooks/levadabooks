import { getT } from '@/locales';
import JsonLd from '@/components/shared/JsonLd';
import { WebPage, Organization, WithContext } from 'schema-dts';
import styles from './styles.module.scss';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

const HomePage = async () => {
    const { t, i18n } = await getT('server');
    const organizationSchema: WithContext<Organization> = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        url: `https://${process.env.BASE_URL}`,
        logo: `https://${process.env.BASE_URL}/assets/images/profile.jpg`,
        name: 'LevadaBooks',
        description: t('LevadaBooksDescription'),
        email: `contact@${process.env.BASE_URL}`
    };
    const webPageSchema: WithContext<WebPage> = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t('HomeTitle'),
        image: 'https://nextjs.org/imgs/sticker.png',
        description: t('HomePageDescription'),
        inLanguage: i18n.resolvedLanguage,
        url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}`
    };

    return (
        <div className={styles.pageCont}>
            {t('src.components.main.Home.title')}
            <JsonLd id="HomePage-ld+json" schema={[organizationSchema, webPageSchema]} />
        </div>
    );
};

HomePage.displayName = 'HomePage';

export default HomePage;

import { getT } from '@/locales';
import JsonLd from '@/components/shared/JsonLd';
import ContactForm from '@/components/main/ContactForm';
import { ContactPage as ContactPageSchema, BreadcrumbList, WithContext } from 'schema-dts';
import styles from './styles.module.scss';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

const ContactPage = async () => {
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
                name: t('ContactTitle')
            }
        ]
    };
    const contactPageSchema: WithContext<ContactPageSchema> = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: t('ContactTitle'),
        image: 'https://nextjs.org/imgs/sticker.png',
        description: t('ContactDescription'),
        inLanguage: i18n.resolvedLanguage,
        url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/contact`
    };

    return (
        <div className={styles.pageCont}>
            <section className={styles.contactCont}>
                <div className={styles.contactInner}>
                    <ContactForm />
                </div>
            </section>
            <JsonLd id="ContactPage-ld+json" schema={[breadcrumbListSchema, contactPageSchema]} />
        </div>
    );
};

ContactPage.displayName = 'ContactPage';

export default ContactPage;

import { BOOK } from '@/enums';
import { getT } from '@/locales';
import LittlePrince from '@/components/main/books/LittlePrince';
import JsonLd from '@/components/shared/JsonLd';
import { MobileApplication, BreadcrumbList, WithContext } from 'schema-dts';
import styles from './styles.module.scss';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

type BookPageProps = {
    id: BOOK;
};

const BookPage = async ({ id }: BookPageProps) => {
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
                name: t('BooksTitle'),
                item: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/books`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: t(`BookTitle.${id}`)
            }
        ]
    };
    const mobileApplicationSchema: WithContext<MobileApplication> = {
        '@context': 'https://schema.org',
        '@type': 'MobileApplication',
        name: t(`BookTitle.${id}`),
        operatingSystem: 'iOS, Android',
        applicationCategory: 'EntertainmentApplication', // "GameApplication" or "LifestyleApplication"
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: 4.6,
            ratingCount: 8864,
            bestRating: 5,
            worstRating: 1
        },
        offers: {
            '@type': 'Offer',
            price: 0,
            priceCurrency: 'USD',
            url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/book/${id}`,
            seller: {
                '@type': 'Organization',
                name: 'LevadaBooks'
            }
        },
        isAccessibleForFree: true,
        image: 'https://nextjs.org/imgs/sticker.png',
        description: t(`BookDescription.${id}`),
        inLanguage: i18n.resolvedLanguage
    };
    const getBookComponent = (id: BOOK) => {
        switch (id) {
            case BOOK.LITTLE_PRINCE:
                return <LittlePrince />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.pageCont}>
            <JsonLd id="BookPage-ld+json" schema={[breadcrumbListSchema, mobileApplicationSchema]} />
            {getBookComponent(id)}
        </div>
    );
};

BookPage.displayName = 'BookPage';

export default BookPage;

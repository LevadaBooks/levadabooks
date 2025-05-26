import Link from '@/components/shared/Link';
import { getT } from '@/locales';
import { BOOK, DEVICE_OS } from '@/enums';
import { bookIds } from '@/constants';
import JsonLd from '@/components/shared/JsonLd';
import { BreadcrumbList, ItemList, WithContext } from 'schema-dts';
import styles from './styles.module.scss';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

const BooksPage = async () => {
    const { i18n, t } = await getT('server');
    const breadcrumbListSchema: WithContext<BreadcrumbList> = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        name: t('BooksTitle'),
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
                name: t('BooksTitle')
            }
        ]
    };
    const itemListSchema: WithContext<ItemList> = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: t('LevadaBooks | BooksTitle'),
        itemListElement: bookIds.map((bookId: BOOK, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: t(`BookTitle.${bookId}`),
            url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/books/${bookId}`,
            image: 'https://nextjs.org/imgs/sticker.png',
            description: t('BooksDescription'),
            inLanguage: i18n.resolvedLanguage
        })),
        url: `https://${process.env.BASE_URL}/${i18n.resolvedLanguage}/books`
    };

    return (
        <div className={styles.pageCont}>
            <JsonLd id="BooksPage-ld+json" schema={[breadcrumbListSchema, itemListSchema]} />
            <ol>
                {bookIds.map((bookId: BOOK) => (
                    <li key={bookId}>
                        <Link href={`/book/${bookId}`}>{t(`book.${bookId}`)}</Link>
                    </li>
                ))}
            </ol>
        </div>
    );
};

BooksPage.displayName = 'BooksPage';

export default BooksPage;

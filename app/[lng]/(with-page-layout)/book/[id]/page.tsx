import { getT } from '@/locales';
import { BOOK } from '@/enums';
import { bookIds } from '@/constants';
import { redirect } from 'next/navigation';
import { languages } from '@/locales/settings';
import type { Metadata, ResolvingMetadata } from 'next';
import BookPage from '@/components/main/pages/BookPage';

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

type StaticParam = {
    lng: string;
    id: BOOK;
};

type MetadataProps = {
    params: Promise<StaticParam>;
};

export async function generateStaticParams() {
    const params: StaticParam[] = [];

    languages.forEach((lng) => {
        bookIds.forEach((id) => {
            params.push({ lng, id });
        });
    });

    return params;
}

export async function generateMetadata(props: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
    const { t } = await getT('server');
    const { lng, id } = await props.params;
    const parentURL = (await parent).openGraph?.url || `https://${process.env.BASE_URL}/${lng}`;
    console.log('params:', lng, id);
    return {
        title: t(`Books.${id}.title`),
        description: t(`BooksDescription.${id}`),
        keywords: t(`BooksKeywords.${id}`), // ['Next.js', 'React', 'JavaScript']
        formatDetection: {
            email: false,
            address: false,
            telephone: false
        },
        alternates: {
            canonical: `/${lng}/book/${id}`,
            languages: languages.reduce<Record<string, string>>((acc, curr) => {
                acc[curr] = `/${curr}/book/${id}`;

                return acc;
            }, {})
        },
        openGraph: {
            url: `${parentURL}/book/${id}`
        }
    };
}

const Page = async ({ params }: { params: Promise<{ lng: string, id: BOOK }> }) => {
    const { lng, id } = await params;

    if (!bookIds.includes(id)) {
        redirect(`/${lng}/books`);
    }

    return <BookPage id={id} />;
};

Page.displayName = 'BooksPage';

export default Page;

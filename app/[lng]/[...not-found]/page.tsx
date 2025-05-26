import { getT } from '@/locales';
import NotFoundPage from '@/components/main/pages/NotFoundPage';

export async function generateMetadata() {
    const { t } = await getT('server');

    return { title: t('pageHeader') };
}

const NotFound = async () => <NotFoundPage />;

NotFound.displayName = 'NotFound';

export default NotFound;

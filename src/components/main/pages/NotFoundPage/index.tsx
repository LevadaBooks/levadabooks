import { getT } from '@/locales';
import Link from '@/components/shared/Link';
import styles from './styles.module.scss';

const NotFoundPage = async () => {
    const { t } = await getT('server');

    return (
        <div className={styles.pageCont}>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/">{t('src.components.main.pages.Subscribe.success.backToHome')}</Link>
        </div>
    );
};

NotFoundPage.displayName = 'NotFoundPage';

export default NotFoundPage;

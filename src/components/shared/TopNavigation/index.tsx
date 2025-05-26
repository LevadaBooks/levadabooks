import Link from '@/components/shared/Link';
import { getT } from '@/locales';
import styles from './styles.module.scss';

const TopNavigation = async () => {
    const { t } = await getT('server');

    return (
        <nav className={styles.topNavigationCont}>
            <ul>
                <li>
                    <Link href="/books">{t('books')}</Link>
                </li>
                <li>
                    <Link href="/about">{t('about')}</Link>
                </li>
                <li>
                    <Link href="/contact">{t('contacts')}</Link>
                </li>
                {
                    /*
                    <li>
                        <Link href="/faq">Contacts</Link>
                    </li>
                    */
                }
            </ul>
        </nav>
    );
};

TopNavigation.displayName = 'TopNavigation';

export default TopNavigation;

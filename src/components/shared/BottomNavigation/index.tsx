import Link from '@/components/shared/Link';
import Image from 'next/image';
import { getT } from '@/locales';
import styles from './styles.module.scss';

const BottomNavigation = async () => {
    const { t } = await getT('server');

    return (
        <section className={styles.bottomNavCont}>
            <div className={styles.bottomNavInner}>
                <div className={styles.bottomNavLinks}>
                    <nav className={styles.bottomNavLinksSocial}>
                        <Link href="/">
                            <Image src="/assets/images/profile.jpg" alt="Profile" width={100} height={100} priority={true} fetchPriority="high" />
                        </Link>
                        <p>{t('footer.privacyPolicy')}</p>
                        <Link href="/privacy-policy">{t('footer.privacyPolicy')}</Link>
                        <Link href="/terms-of-use">{t('footer.termsOfUse')}</Link>
                        <Link href="/cookie-policy">{t('footer.cookiePolicy')}</Link>
                    </nav>
                    <nav className={styles.bottomNavLinkSite}>
                        <Link href="/privacy-policy">{t('footer.privacyPolicy')}</Link>
                        <Link href="/terms-of-use">{t('footer.termsOfUse')}</Link>
                        <Link href="/cookie-policy">{t('footer.cookiePolicy')}</Link>
                    </nav>
                </div>
            </div>
        </section>
    );
};

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation;

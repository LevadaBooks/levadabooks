import SiteLogo from '@/components/shared/SiteLogo';
import TopNavigation from '@/components/shared/TopNavigation';
import LngSelector from '@/components/shared/LngSelector';
import styles from './styles.module.scss';

const Header = () => (
    <header className={styles.headerCont}>
        <SiteLogo />
        <TopNavigation />
        <LngSelector />
    </header>
);

Header.displayName = 'Header';

export default Header;

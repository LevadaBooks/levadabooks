import SubscribeBlock from '@/components/shared/SubscribeBlock';
import BottomNavigation from '@/components/shared/BottomNavigation';
import Copyright from '@/components/shared/Copyright';
import styles from './styles.module.scss';

const Footer = () => (
    <footer className={styles.footerCont}>
        <SubscribeBlock />
        <BottomNavigation />
        <Copyright />
    </footer>
);

Footer.displayName = 'Footer';

export default Footer;

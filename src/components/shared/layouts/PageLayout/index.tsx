import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import styles from './styles.module.scss';

type PageLayoutProps = {
    children: React.ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => (
    <div className={styles.pageCont}>
        <Header />
        <main>{children}</main>
        <Footer />
    </div>
);

PageLayout.displayName = 'PageLayout';

export default PageLayout;

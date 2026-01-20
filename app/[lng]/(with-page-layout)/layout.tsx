import PageLayout from '@/components/shared/layouts/PageLayout';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => <PageLayout>{children}</PageLayout>;

Layout.displayName = 'Layout';

export default Layout;

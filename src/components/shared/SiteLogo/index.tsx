import Link from '@/components/shared/Link';
import Image from 'next/image';
import styles from './styles.module.scss';

const SiteLogo = () => (
    <div className={styles.siteLogoCont}>
        <Link href="/">
            <Image src="/assets/images/profile.jpg" alt="Profile" width={100} height={100} priority={true} fetchPriority="high" />
        </Link>
    </div>
);

SiteLogo.displayName = 'SiteLogo';

export default SiteLogo;

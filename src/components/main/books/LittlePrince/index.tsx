import Image from 'next/image';
import { getT } from '@/locales';
import styles from './styles.module.scss';

const LittlePrince = async () => {
    const { t } = await getT('server');

    return (
        <div className={styles.pageCont}>
            <Image src="/assets/images/profile.jpg" alt="Profile" width={100} height={100} priority fetchPriority="high" />
            {t('LittlePrince')}
        </div>
    );
};

LittlePrince.displayName = 'LittlePrince';

export default LittlePrince;

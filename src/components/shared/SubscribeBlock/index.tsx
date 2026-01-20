import Image from 'next/image';
import { getT } from '@/locales';
import SubscribeForm from './SubscribeForm';
import styles from './styles.module.scss';

const SubscribeBlock = async () => {
    const { t } = await getT('server');

    return (
        <section className={styles.subscribeCont}>
            <div className={styles.subscribeInner}>
                <div className={styles.subscribePromo}>
                    <div className={styles.subscribePromoInfo}>
                        <div className={styles.subscribePromoText}>{t('src.components.shared.SubscribeBlock.promoText')}</div>
                        <div className={styles.subscribePromoImage}>
                            <Image
                                src="/assets/images/profile.jpg"
                                alt="Profile"
                                width={100}
                                height={100}
                                priority={true}
                                fetchPriority="high"
                            />
                        </div>
                    </div>
                    <div className={styles.subscribePromoForm}>
                        <SubscribeForm />
                        <div className={styles.subscribePromoFormText}>asasdasd</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

SubscribeBlock.displayName = 'SubscribeBlock';

export default SubscribeBlock;

import { getT } from '@/locales';
import styles from './styles.module.scss';

const Copyright = async () => {
    const { t } = await getT('server');

    return (
        <section className={styles.copyrightCont}>
            <div className={styles.copyrightInner}>
                <div className={styles.copyrightTextCont}>
                    <p className={styles.copyrightText}>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
                </div>
            </div>
        </section>
    );
};

Copyright.displayName = 'Copyright';

export default Copyright;

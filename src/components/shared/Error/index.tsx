//import { getT } from '@/locales';
import styles from './styles.module.scss';

const Error = ({ onClick }: { onClick: () => void }) => {
    return (
        <div className={styles.pageCont}>
            <h2>Something went wrong!</h2>
            <button onClick={onClick}>
                Try again
            </button>
        </div>
    );
};

Error.displayName = 'Error';

export default Error;

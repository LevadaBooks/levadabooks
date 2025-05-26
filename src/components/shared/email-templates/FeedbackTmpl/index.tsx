import { Html, Head, Body, Preview, Container, Section, Text, Link } from '@react-email/components';
import { dir } from 'i18next';
import { getT } from '@/locales';
import { render } from '@react-email/render';
import { fallbackLng } from '@/locales/settings';

type FeedbackProps = {
    type: string;
    name: string;
    email?: string;
    message: string;
};

const FeedbackTmpl = async ({ type, name, email, message }: FeedbackProps) => {
    const { t, i18n } = await getT('server');
    const lng = i18n.resolvedLanguage || fallbackLng;

    return (
        <Html lang={lng} dir={dir(lng)}>
            <Head>
                <title>{t(`src.components.shared.email-templates.FeedbackTmpl.title.${type}`)}</title>
            </Head>
            <Body style={styles.main}>
                <Preview>{message}</Preview>
                <Container style={styles.container}>
                    <Section>
                        <Text style={styles.text}>User name: {name}</Text>
                        { email ? <Text style={styles.text}>
                            User email:{' '}
                            <Link style={styles.anchor} href={`mailto:${email}`}>
                                {email}
                            </Link>
                        </Text> : null }
                        { message ? <Text style={styles.text}>User message: {message}</Text> : null }
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const styles = {
    main: {
        backgroundColor: '#f6f9fc',
        padding: '10px 0'
    },
    container: {
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
        padding: '45px'
    },
    text: {
        fontSize: '16px',
        fontFamily:
            "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
        fontWeight: '300',
        color: '#404040',
        lineHeight: '26px'
    },
    anchor: {
        textDecoration: 'underline'
    }
};

const getFeedbackTmplTxt = async (params: FeedbackProps) =>
    await render(<FeedbackTmpl {...params} />, {
        plainText: true
    });

export { FeedbackTmpl, getFeedbackTmplTxt };

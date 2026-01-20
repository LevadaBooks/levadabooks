import { Html, Head, Body, Button, Preview, Container, Section, Text, Img, Link } from '@react-email/components';
import { dir } from 'i18next';
import { getT } from '@/locales';
import { render } from '@react-email/render';
import { fallbackLng } from '@/locales/settings';

type SubscribeProps = {
    url: string;
};

const baseUrl = process.env.BASE_URL ? `https://${process.env.BASE_URL}` : '';

const SubscribeTmpl = async ({ url }: SubscribeProps) => {
    const { t, i18n } = await getT('server');
    const lng = i18n.resolvedLanguage || fallbackLng;

    return (
        <Html lang={lng} dir={dir(lng)}>
            <Head>
                <title>{t('My email title')}</title>
            </Head>
            <Body style={styles.main}>
                <Preview>Email preview text</Preview>
                <Container style={styles.container}>
                    <Img
                        src={`${baseUrl}/assets/images/profile.jpg`}
                        width="100"
                        height="100"
                        alt="Dropbox"
                    />
                    <Section>
                        <Text style={styles.text}>
                            Hi
                            {'User'},
                        </Text>
                        <Text style={styles.text}>
                            Someone recently requested a password change for your Dropbox account. If this was you, you
                            can set a new password here:
                        </Text>
                        <Button style={styles.button} href={url}>
                            Reset password
                        </Button>
                        <Text style={styles.text}>
                            If you don&apos;t want to change your password or didn&apos;t request this, just ignore and
                            delete this message.
                        </Text>
                        <Text style={styles.text}>
                            To keep your account secure, please don&apos;t forward this email to anyone. See our Help
                            Center for{' '}
                            <Link style={styles.anchor} href={url}>
                                more security tips.
                            </Link>
                        </Text>
                        <Text style={styles.text}>Happy Dropboxing!</Text>
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
    button: {
        backgroundColor: '#007ee6',
        borderRadius: '4px',
        color: '#fff',
        fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
        fontSize: '15px',
        textDecoration: 'none',
        textAlign: 'center' as const,
        display: 'block',
        width: '210px',
        padding: '14px 7px'
    },
    anchor: {
        textDecoration: 'underline'
    }
};

const getSubscribeTmplTxt = async (params: SubscribeProps) =>
    await render(<SubscribeTmpl {...params} />, {
        plainText: true
    });

export { SubscribeTmpl, getSubscribeTmplTxt };

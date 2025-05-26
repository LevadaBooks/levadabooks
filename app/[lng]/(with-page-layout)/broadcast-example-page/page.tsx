import { getT } from '@/locales';
//import { Resend } from 'resend';

if (typeof process.env.RESEND_API_KEY !== 'string') {
    throw new Error('RESEND_API_KEY is not defined');
}

if (typeof process.env.RESEND_GENERAL_AUDIENCE_ID !== 'string') {
    throw new Error('RESEND_GENERAL_AUDIENCE_ID is not defined');
}

//const resend = new Resend(process.env.RESEND_API_KEY);

export async function generateMetadata() {
    const { t } = await getT('server');

    return { title: t('pageHeader') };
}

const Page = async () => {
    /*
    const broadcastsCreate = await resend.broadcasts.create({
        name: 'Test Broadcast',
        audienceId: process.env.RESEND_GENERAL_AUDIENCE_ID!,
        from: `LevadaBooks <updates@${process.env.BASE_URL}>`,
        subject: 'hello world',
        html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}'
    });

    if (broadcastsCreate.error) {
        throw new Error(`Failed to create broadcast: ${broadcastsCreate.error.message}`);
    }

    if (!broadcastsCreate.data?.id) {
        throw new Error('Broadcast ID is not defined');
    }

    const broadcastsSend = await resend.broadcasts.send(broadcastsCreate.data.id);

    if (broadcastsSend.error) {
        throw new Error(`Failed to send broadcast: ${broadcastsSend.error.message}`);
    }

    if (!broadcastsSend.data?.id) {
        throw new Error('Broadcast send ID is not defined');
    }

    return broadcastsSend.data.id;
    */
   return null;
};

Page.displayName = 'Page';

export default Page;

'use client';

import { memo, SyntheticEvent, useCallback, useActionState, useRef } from 'react';
import { useT } from '@/locales/client';
import Script from 'next/script';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import * as Sentry from '@sentry/nextjs';
import { submit } from './actions';
import styles from './styles.module.scss';

if (!process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY) {
    throw new Error('NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY is not defined');
}

declare global {
    const grecaptcha: {
        enterprise: {
            ready: (cb: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
        };
        ready: (cb: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
}

type ContactFormState = {
    success: boolean;
    name: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
    email: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
    title: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
    message: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
    recaptchaToken: {
        defaultValue: string;
        isValid: boolean;
        message: string;
    };
};

const initialState: ContactFormState = {
    success: false,
    name: {
        defaultValue: '',
        isValid: true,
        message: ''
    },
    email: {
        defaultValue: '',
        isValid: true,
        message: ''
    },
    title: {
        defaultValue: '',
        isValid: true,
        message: ''
    },
    message: {
        defaultValue: '',
        isValid: true,
        message: ''
    },
    recaptchaToken: {
        defaultValue: '',
        isValid: true,
        message: ''
    }
};

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
const RECAPTCHA_USE_ENTERPRISE = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_USE_ENTERPRISE;

const SuccessFormMsg = memo(() => {
    const { t } = useT('client');

    return (
        <Box className={styles.successFormMsg}>
            <h2>{t('Thank you for your feedback!')}</h2>
            <p>{t('We will contact you as soon as possible.')}</p>
        </Box>
    );
});

SuccessFormMsg.displayName = 'SuccessFormMsg';

const ContactForm = memo(() => {
    const { t } = useT('client');
    const recaptchaTokenRef = useRef<HTMLInputElement | null>(null);
    const [state, formAction, pending] = useActionState(submit, initialState);
    const validateRequired = useCallback(
        (event: SyntheticEvent) => {
            const inputElement = event.target as HTMLInputElement;

            if (inputElement) {
                /*if (!inputElement.validity.valid) {
                        inputElement.setCustomValidity(t('I am expecting an email address!'));
                    }*/

                if (inputElement.validity.valueMissing) {
                    inputElement.setCustomValidity(t('I am expecting a name!'));
                } else {
                    inputElement.setCustomValidity('');
                }

                inputElement.reportValidity();
            }
        },
        [t]
    );
    const validateEmail = useCallback(
        (event: SyntheticEvent) => {
            const inputElement = event.target as HTMLInputElement;

            if (inputElement) {
                /*if (!inputElement.validity.valid) {
                        inputElement.setCustomValidity(t('I am expecting an email address!'));
                    }*/

                if (inputElement.validity.typeMismatch || inputElement.validity.valueMissing) {
                    inputElement.setCustomValidity(t('I am expecting an email address!'));
                } else {
                    inputElement.setCustomValidity('');
                }

                inputElement.reportValidity();
            }
        },
        [t]
    );
    const executeRecaptcha = useCallback(() => {
        if (typeof grecaptcha !== 'undefined') {
            if (RECAPTCHA_USE_ENTERPRISE) {
                grecaptcha.enterprise.ready(async () => {
                    try {
                        const token = await grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action: 'contact' });

                        if (token && recaptchaTokenRef.current) {
                            recaptchaTokenRef.current.value = token;
                        }
                    } catch (error) {
                        Sentry.captureException(error);
                        console.error('Recaptcha error', error);
                    }
                });
            } else {
                grecaptcha.ready(async () => {
                    try {
                        const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact' });

                        if (token && recaptchaTokenRef.current) {
                            recaptchaTokenRef.current.value = token;
                        }
                    } catch (error) {
                        Sentry.captureException(error);
                        console.error('Recaptcha error', error);
                    }
                });
            }
        }
    }, []);
    const recaptchaScriptSrc = RECAPTCHA_USE_ENTERPRISE
        ? `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`
        : `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;

    return state?.success ? (
        <SuccessFormMsg />
    ) : (
        <Box component="form" autoComplete="off" action={formAction} className={styles.contactForm}>
            <Script src={recaptchaScriptSrc} onLoad={executeRecaptcha} />
            <FormControl className={styles.contactFormControl}>
                <FormLabel id="type-control-label">{t('Type')}</FormLabel>
                <RadioGroup aria-labelledby="type-control-label" defaultValue="private" name="type" row>
                    <FormControlLabel
                        value="private"
                        control={<Radio />}
                        label={t('Private')}
                        title={t('Feedback or improvements suggestions')}
                    />
                    <FormControlLabel
                        value="professional"
                        control={<Radio />}
                        label={t('Professional')}
                        title={t('Cooperations proposal')}
                    />
                    <FormControlLabel
                        value="commercial"
                        control={<Radio />}
                        label={t('Commercial')}
                        title={t('Commercial proposals')}
                    />
                </RadioGroup>
            </FormControl>
            <FormControl className={styles.contactFormControl}>
                <FormLabel id="name-control-label">{t('Name')}</FormLabel>
                <TextField
                    aria-labelledby="name-control-label"
                    type="text"
                    name="name"
                    variant="outlined"
                    required
                    fullWidth
                    onBlur={validateRequired}
                    placeholder={t('Enter your name')}
                    title={t('Please fill this field')}
                    error={!state?.name.isValid}
                    helperText={pending ? '' : state?.name.message}
                    defaultValue={state?.name.defaultValue}
                />
            </FormControl>
            <FormControl className={styles.contactFormControl}>
                <FormLabel id="email-control-label">Email</FormLabel>
                <TextField
                    aria-labelledby="email-control-label"
                    type="email"
                    name="email"
                    variant="outlined"
                    required
                    fullWidth
                    onBlur={validateEmail}
                    placeholder={t('Enter your email address')}
                    title={t('Please enter a valid email address')}
                    error={!state?.email.isValid}
                    defaultValue={state?.email.defaultValue}
                    helperText={pending ? '' : state?.email.message}
                />
            </FormControl>
            <FormControl className={styles.contactFormControl}>
                <FormLabel id="title-control-label">Title</FormLabel>
                <TextField
                    aria-labelledby="title-control-label"
                    type="text"
                    name="title"
                    variant="outlined"
                    required
                    fullWidth
                    onBlur={validateRequired}
                    placeholder={t('Message title')}
                    title={t('Please fill this field')}
                    error={!state?.title.isValid}
                    defaultValue={state?.title.defaultValue}
                    helperText={pending ? '' : state?.title.message}
                />
            </FormControl>
            <FormControl className={styles.contactFormControl}>
                <FormLabel id="message-control-label">Message</FormLabel>
                <TextField
                    aria-labelledby="message-control-label"
                    type="text"
                    name="message"
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    rows="4"
                    onBlur={validateRequired}
                    placeholder={t('Message text')}
                    title={t('Please fill this field')}
                    error={!state?.message.isValid}
                    defaultValue={state?.message.defaultValue}
                    helperText={pending ? '' : state?.message.message}
                />
            </FormControl>
            <FormControl className={styles.contactFormControl}>
                <Input type="hidden" name="recaptchaToken" id="recaptchaToken" inputRef={recaptchaTokenRef} />
                <FormHelperText error={!state?.recaptchaToken.isValid}>{state?.recaptchaToken.message}</FormHelperText>
            </FormControl>
            <FormControl className={styles.contactFormControl}>
                <Button type="submit" variant="contained" disabled={pending}>
                    {t('Submit')}
                </Button>
            </FormControl>
        </Box>
    );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;

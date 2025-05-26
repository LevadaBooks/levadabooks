'use client';

import { memo, SyntheticEvent, useCallback, useActionState } from 'react';
import { useT } from '@/locales/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { subscribe } from './actions';
import styles from './styles.module.scss';

type SubscribeFormState = {
    isValid: boolean;
    message: string;
    defaultValue: string;
};

const initialState: SubscribeFormState = {
    isValid: true,
    message: '',
    defaultValue: '',
};

const SubscribeForm = memo(() => {
    const { t } = useT('client');
    const [state, formAction, pending] = useActionState(subscribe, initialState);
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

    return (
        <Box component="form" autoComplete="off" action={formAction} className={styles.subscribePromoFormControl}>
            <TextField
                type="email"
                name="email"
                variant="outlined"
                required
                fullWidth
                onBlur={validateEmail}
                autoComplete="email"
                placeholder='Enter your email address'
                title="Please enter a valid email address"
                error={!state?.isValid}
                defaultValue={state?.defaultValue}
                helperText={pending ? t('src.components.shared.Subscribe.pending') : state?.message}
            />
            <Button type="submit" variant="contained" disabled={pending}>
                Subscribe
            </Button>
        </Box>
    );
});

SubscribeForm.displayName = 'SubscribeForm';

export default SubscribeForm;

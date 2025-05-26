'use client';

import { memo, SyntheticEvent, useCallback, useActionState } from 'react';
import { useT } from '@/locales/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { unsubscribe } from './actions';
import styles from './styles.module.scss';

type UnsubscribeFormState = {
    isValid: boolean;
    message: string;
};

const initialState: UnsubscribeFormState = {
    isValid: true,
    message: '',
};

const UnsubscribeBlock = memo(() => {
    const { t } = useT('client');
    const [state, formAction, pending] = useActionState(unsubscribe, initialState);
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
        <Box component="form" autoComplete="off" action={formAction} className={styles.unsubscribePromoFormControl}>
            <TextField
                type="email"
                name="email"
                variant="outlined"
                required
                fullWidth
                onBlur={validateEmail}
                placeholder='Enter your email address'
                title="Please enter a valid email address"
                error={!state?.isValid}
                helperText={pending ? t('src.components.shared.Unsubscribe.pending') : state?.message}
            />
            <Button type="submit" variant="contained" disabled={pending}>
                Unsubscribe
            </Button>
        </Box>
    );
});

UnsubscribeBlock.displayName = 'UnsubscribeBlock';

export default UnsubscribeBlock;

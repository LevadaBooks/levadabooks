'use client';

import i18next from '@/locales/i18next';
import { KeyPrefix } from 'i18next';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation, UseTranslationOptions } from 'react-i18next';

const runsOnServerSide = typeof window === 'undefined';

export function useT(ns?: string, options?: UseTranslationOptions<KeyPrefix<string>>) {
    const lng = useParams()?.lng;
    const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);

    useEffect(() => {
        if (activeLng === i18next.resolvedLanguage) {
            return;
        }

        setActiveLng(i18next.resolvedLanguage);
    }, [activeLng/*, i18next.resolvedLanguage*/]);

    useEffect(() => {
        if (!lng || i18next.resolvedLanguage === lng) {
            return;
        }

        if (typeof lng !== 'string') {
            throw new Error('useT is only available inside /app/[lng]');
        }

        i18next.changeLanguage(lng);
    }, [lng/*, i18next*/]);

    if (runsOnServerSide && i18next.resolvedLanguage !== lng) {
        if (typeof lng !== 'string') {
            throw new Error('useT is only available inside /app/[lng]');
        }

        i18next.changeLanguage(lng);
    }

    return useTranslation(ns, options);
}

import React, { createContext, useContext, useMemo } from 'react';
import { fetchPersonalInfo } from '../services/api';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { getPersonalInfoQueryFallback } from '../lib/personalInfoFallbacks';
import { getString } from '../lib/strings';

const LocaleContext = createContext({ locale: 'en', t: (k) => k });

export function LocaleProvider({ children }) {
  const { data } = useRealtimeQuery('personal_info', fetchPersonalInfo, getPersonalInfoQueryFallback());
  const locale = data?.locale ?? 'en';
  const value = useMemo(
    () => ({ locale, t: (key) => getString(locale, key) }),
    [locale]
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

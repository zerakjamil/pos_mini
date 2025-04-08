import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RtlContextType {
  isRtl: boolean;
}

const RtlContext = createContext<RtlContextType>({ isRtl: false });

export function RtlProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'kur';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

    if (isRtl) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language, isRtl]);

  return (
    <RtlContext.Provider value={{ isRtl }}>
      {children}
    </RtlContext.Provider>
  );
}

export const useRtl = () => useContext(RtlContext);

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
.use(Backend)
.use(LanguageDetector)
.use(initReactI18next)
.init({
  fallbackLng: 'kur',
  debug: process.env.NODE_ENV === 'development',
  load: 'languageOnly',

  caches: ['localStorage'],
  cacheTTL: 48 * 60 * 60, // 48 hours

  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },

  react: {
    useSuspense: false,
    wait: true
  }
});

export default i18n;

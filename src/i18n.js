import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

import en from './translations/en/translation.json';
import br from './translations/br/translation.json';

i18n
.use(Backend)
.use(LanguageDetector)
.use(initReactI18next)
.init({
    debug: true,
    lng: "br",
    fallbackLng: "en",
    returnObjects: true,
    resources: {
      en: { translation: en },
      br: { translation: br },
    },
    
})
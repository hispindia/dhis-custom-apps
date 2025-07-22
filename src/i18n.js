import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReacti18next } from 'i18next';
import Backend from 'i18next-http-backend';


i18n
.use(Backend)
.use(LanguageDetector)
.use(initReacti18next)
.init({
    debug: true,
    fallback: "br",
    returnObjects: true,
    backend: {
        localPath: "locale/{{lng}}/translation.json"
    }
})
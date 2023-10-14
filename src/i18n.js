import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {resources} from "./Translation";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)

    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        debug: false,
        react: {
            useSuspense: false, //   <---- this will do the magic
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

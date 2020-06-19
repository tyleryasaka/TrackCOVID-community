import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Locize from 'i18next-locize-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './translations/en'

const locizeProductId = process.env['REACT_APP_LOCIZE_PRODUCT_ID']

const resources = locizeProductId ? undefined : { en }

const i18nSetup = locizeProductId
  ? i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(Locize)
  : i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next

i18nSetup.init({
  resources,
  backend: {
    projectId: locizeProductId
  },
  load: 'all',
  fallbackLng: 'en',
  keySeparator: false, // we do not use keys in form messages.welcome
  interpolation: {
    escapeValue: false // react already safes from xss
  },
  detection: {
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // cache user language on
    caches: ['localStorage', 'cookie'],

    // optional htmlTag with lang attribute, the default is:
    htmlTag: document.documentElement
  }
})

export default i18n

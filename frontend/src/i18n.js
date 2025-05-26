import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslation from './locals/en/translation.json';
import esTranslation from './locals/es/translation.json';

// the translations
const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en', 
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false 
    },
    
    react: {
      useSuspense: true
    }
  });

export default i18n;
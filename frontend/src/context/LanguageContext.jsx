import { createContext, useContext, useState } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';

const translations = { en, hi, mr };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  const t = (key) => {
    const keys = key.split('.');
    let val = translations[language];
    for (const k of keys) {
      val = val?.[k];
      if (val === undefined) {
        // fallback to English
        let fallback = translations['en'];
        for (const fk of keys) fallback = fallback?.[fk];
        return fallback || key;
      }
    }
    return val || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

import { useState, useEffect } from 'react';
import { fr } from '@/translations/fr';
import { en } from '@/translations/en';

type Language = 'fr' | 'en';

const translations = {
  fr,
  en
};

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Load saved language on app start
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return {
    language,
    changeLanguage,
    t,
    translations: translations[language]
  };
}

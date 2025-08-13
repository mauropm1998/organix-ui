import { useState, useEffect } from 'react';

export type Language = 'en' | 'pt';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('organix-language') as Language;
    const browserLanguage = navigator.language.startsWith('pt') ? 'pt' : 'en';
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      setLanguage(browserLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('organix-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  return { language, toggleLanguage, setLanguage };
};
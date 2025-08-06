import { ref, onMounted, watch } from 'vue';
import { translations } from '../translations/index.js';

/**
 * Composable for language management
 * @returns {Object} Language state and methods
 */
export const useLanguage = () => {
  const language = ref('en');

  onMounted(() => {
    const savedLanguage = localStorage.getItem('organix-language');
    const browserLanguage = navigator.language.startsWith('pt') ? 'pt' : 'en';
    
    if (savedLanguage) {
      language.value = savedLanguage;
    } else {
      language.value = browserLanguage;
    }
  });

  watch(language, (newLanguage) => {
    localStorage.setItem('organix-language', newLanguage);
  });

  const toggleLanguage = () => {
    language.value = language.value === 'en' ? 'pt' : 'en';
  };

  const setLanguage = (lang) => {
    language.value = lang;
  };

  const t = (key, lang = null) => {
    const currentLang = lang || language.value;
    return translations[currentLang]?.[key] || key;
  };

  return { language, toggleLanguage, setLanguage, t };
};
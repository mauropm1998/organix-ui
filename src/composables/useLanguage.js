import { ref, onMounted, watch } from 'vue';

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

  return { language, toggleLanguage, setLanguage };
};
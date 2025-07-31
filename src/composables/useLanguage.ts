import { ref, onMounted, watch } from 'vue';

export type Language = 'en' | 'pt';

export const useLanguage = () => {
  const language = ref<Language>('en');

  onMounted(() => {
    const savedLanguage = localStorage.getItem('organix-language') as Language;
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

  const setLanguage = (lang: Language) => {
    language.value = lang;
  };

  return { language, toggleLanguage, setLanguage };
};
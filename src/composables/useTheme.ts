import { ref, onMounted, watch } from 'vue';

export const useTheme = () => {
  const theme = ref<'light' | 'dark'>('light');

  onMounted(() => {
    const savedTheme = localStorage.getItem('organix-theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      theme.value = savedTheme;
    } else if (prefersDark) {
      theme.value = 'dark';
    }
  });

  watch(theme, (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('organix-theme', newTheme);
  }, { immediate: true });

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  return { theme, toggleTheme };
};
import { ref, watchEffect } from 'vue'

const theme = ref('light')

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  watchEffect(() => {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
  })
  return { theme, toggleTheme }
}

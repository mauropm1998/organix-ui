import { ref } from 'vue'

const language = ref('pt')

export function useLanguage() {
  function setLanguage(lang) {
    language.value = lang
  }
  return { language, setLanguage }
}

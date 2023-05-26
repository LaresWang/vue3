import { ref } from 'vue'
import { defineStore } from "pinia"
import { getCurrentLang, setCurrentLang, type TLangs } from "../locale"

const useLanguage = defineStore("language", ()=>{
  const language = ref(getCurrentLang())
  const setLang = (lang: TLangs) => {
    setCurrentLang(lang)
    language.value = lang
  }

  return {language, setLang}
})

export default useLanguage
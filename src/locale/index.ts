import { createI18n } from "vue-i18n"

import elementEnLocale from "element-plus/lib/locale/lang/en"
import elementZhLocale from "element-plus/lib/locale/lang/zh-cn"

import enLocale from "./lang/en"
import zhLocale from "./lang/zh-cn"

export type TLangs = "en"|"zh"
export const defaultLang = "zh"
export const langKey = "current-lang"

const messages = {
  en: {
    ...elementEnLocale,
    ...enLocale,
  },
  zh: {
    ...elementZhLocale,
    ...zhLocale,
  }
}

export const setCurrentLang = (lang: TLangs) => {
  i18n.global.locale = lang
  localStorage.setItem(langKey, lang)
}

export const getCurrentLang = (): TLangs =>{
  const storeLang = localStorage.getItem(langKey)
  if (storeLang) {
    return storeLang as TLangs
  }
  const browserLang = navigator.language.toLowerCase()
  const supportLangs = Object.keys(messages)
  supportLangs.forEach((lang:string)=>{
    if (browserLang.includes(lang)){
      return lang as TLangs
    }
  })
  return defaultLang
}

const i18n = createI18n({
  locale: getCurrentLang(),
  fallbackLocale: defaultLang,
  messages,
})

export default i18n

export const t = i18n.global.t
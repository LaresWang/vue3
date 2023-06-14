import { ref } from "vue"
import { defineStore } from "pinia"
import { isSafari } from "@/utils/browser"
import { debounce } from "lodash-es"

export default defineStore("fixSize", () => {
  const needFix = ref(false)
  const resize = () => {
    if (isSafari()) {
      let currentWidth = document.documentElement.clientWidth
      if (currentWidth < 1440) {
        needFix.value = true
      }

      const resizeHandler = debounce(() => {
        currentWidth = document.documentElement.clientWidth
        if (currentWidth < 1440) {
          needFix.value = true
        } else {
          needFix.value = false
        }
      }, 300)

      window.addEventListener("resize", resizeHandler)
    }
  }
  resize()

  return { needFix }
})

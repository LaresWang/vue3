import { ref } from "vue"
import { isSafari } from "@/utils/browser"
import { debounce } from "lodash-es"

export default () => {
  const THRESHOLD = 1440
  const needFix = ref(false)
  const resize = () => {
    if (isSafari()) {
      console.log("isSafari")
      let currentWidth = document.documentElement.clientWidth
      if (currentWidth < THRESHOLD) {
        needFix.value = true
      }

      const resizeHandler = debounce(() => {
        currentWidth = document.documentElement.clientWidth
        if (currentWidth < THRESHOLD) {
          needFix.value = true
        } else {
          needFix.value = false
        }
        console.log("needFix", needFix.value)
      }, 300)

      window.addEventListener("resize", resizeHandler)
    }
  }
  resize()

  return { needFix }
}

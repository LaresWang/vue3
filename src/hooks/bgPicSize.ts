import { onMounted, type Ref } from "vue"

export default (element: Ref<HTMLElement | undefined>, rate: number) => {
  let el: HTMLElement
  onMounted(() => {
    if (!element.value) {
      return
    }
    el = element.value
    bgPicHandler()
    if (typeof ResizeObserver !== "undefined") {
      const resizeEL = new ResizeObserver(bgPicHandler)
      resizeEL.observe(el)
    } else {
      window.addEventListener("resize", bgPicHandler)
    }
  })

  const bgPicHandler = () => {
    const whrate = el!.offsetWidth / el!.offsetHeight
    if (whrate > rate) {
      el!.style.backgroundSize = "100%"
    } else {
      el!.style.backgroundSize = "auto 100%"
    }
  }
}

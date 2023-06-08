console.log(navigator.userAgent)
const isInMobile = navigator.userAgent.toLowerCase().includes("mobile")
const baseWidth = isInMobile ? 375 : 1440 // 根据设计稿的宽度大小，设计稿的每个页面宽度保持一致
const baseSize = isInMobile ? 10 : 14 // 与postcss config里的rootValue保持一致
const setRootSize = () => {
  const scale = Math.max(900, document.documentElement.clientWidth) / baseWidth
  const size = baseSize * Math.min(scale, 2)
  document.documentElement.style.fontSize = size + "px"
}
setRootSize()

window.addEventListener("resize", setRootSize)

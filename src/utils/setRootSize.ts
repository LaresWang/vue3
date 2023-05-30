console.log(navigator.userAgent)
const isInMobile = navigator.userAgent.toLowerCase().includes("mobile")
const baseWidth = isInMobile ? 375 : 1280 // 根据设计稿的宽度大小，设计稿的每个页面宽度保持一致
const baseSize = isInMobile ? 10 : 14 // 与postcss config里的rootValue保持一致
const setRootSize = () => {
  const scale = document.documentElement.clientWidth / baseWidth
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + "px"
}
setRootSize()

window.addEventListener("resize", setRootSize)

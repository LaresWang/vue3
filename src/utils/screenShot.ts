const getVideoInfos = (selector: string) => {
  const ele = document.getElementById(selector)
  if (!ele) {
    return null
  }
  const el = ele as HTMLVideoElement
  return { el, width: el.videoWidth, height: el.videoHeight }
}

const getImgDataFromVideo = (selector: string): string => {
  const video = getVideoInfos(selector)
  if (!video) {
    return ""
  }

  const canvas = document.createElement("canvas")
  canvas.height = video.height
  canvas.width = video.width
  const ctx = canvas.getContext("2d")
  ctx?.drawImage(video.el, 0, 0, video.width, video.height)

  return canvas.toDataURL("image/png")
}

const transferB64toBlob = (data: string): Blob => {
  data = data.split(",")[1]
  data = window.atob(data)

  const ia = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    ia[i] = data.charCodeAt(i)
  }
  // 返回 blob 对象
  return new Blob([ia], {
    type: "image/png"
  })
}

const transferBlob2File = (data: Blob, fileName?: string, mime?: string): File => {
  return new window.File([data], fileName || "", { type: mime || "image/*" })
}

export { getImgDataFromVideo, transferB64toBlob, transferBlob2File }

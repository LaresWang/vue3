const getVideoInfos = (videoId: string) => {
  const ele = document.getElementById(videoId)
  if (!ele) {
    return null
  }
  const el = ele as HTMLVideoElement
  return { el, width: el.videoWidth, height: el.videoHeight }
}

const getImgDataFromVideo = (videoId: string, containerId?: string): string => {
  const video = getVideoInfos(videoId)
  if (!video) {
    return ""
  }

  const canvas = document.createElement("canvas")
  let container: HTMLElement | null = null
  if (containerId) {
    container = document.getElementById(containerId)
  }
  if (container) {
    const cwidth = container.offsetWidth
    const cheight = container.offsetHeight
    // video填满container高度
    const canvasSize = Math.min(cwidth, cheight, video.width)
    console.log(canvasSize, 33333)
    // 下面是截视口内video的部分 且截正方形
    canvas.height = canvasSize
    canvas.width = canvasSize
    const ctx = canvas.getContext("2d")

    if (video.width < cwidth) {
      ctx?.drawImage(video.el, 0, 0, video.width, video.height, 0, 0, canvasSize, canvasSize)
    } else {
      const vrate = video.width / video.height
      const sh = canvasSize / vrate
      if (sh < canvasSize) {
        const ncanvasSize = sh
        canvas.height = ncanvasSize
        canvas.width = ncanvasSize
      }
      
      //  drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) 剪切图像，并在画布上定位被剪切的部分
      ctx?.drawImage(video.el, video.width / 2 - cwidth / 2, (video.height - sh) / 2, canvasSize, sh, 0, 0, canvas.width, canvas.height)
    }

  } else {
    // 下面是截video全部
    canvas.height = video.height
    canvas.width = video.width
    const ctx = canvas.getContext("2d")
    ctx?.drawImage(video.el, 0, 0, video.width, video.height)
  }

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

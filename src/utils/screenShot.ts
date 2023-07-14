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
    const { width: vwidth, height: vheight } = video

    const crate = cwidth / cheight
    const vrate = vwidth / vheight
    // video填满container高度 cheight=vheight
    const canvasSize = Math.min(cwidth, cheight, vwidth)
    console.log(canvasSize, 33333)
    // 下面是截视口内video的部分 且截正方形
    canvas.height = canvasSize
    canvas.width = canvasSize
    const ctx = canvas.getContext("2d")

    //  drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) 剪切图像，并在画布上定位被剪切的部分
    // sw/sh 与 dw/dh的比例需要保持一致，否则画布会出现填不满现象

    // 视频宽度小于容器宽度
    if (vwidth < cwidth) {
      if (vrate > 1) {
        // 视频 宽大与高 canvasSize=vheight  canvasSize < vwidth
        ctx?.drawImage(video.el, (vwidth - canvasSize) / 2, 0, vheight, vheight, 0, 0, canvasSize, canvasSize)
      } else {
        // 视频 宽小于等于高 canvasSize=vwidth  canvasSize < vheight
        ctx?.drawImage(video.el, 0, 0, vwidth, vwidth, 0, 0, canvasSize, canvasSize)
      }
    } else {
      // 视频宽度大于等于容器宽度
      if (crate > 1) {
        // 容器 宽大于高 canvasSize=vheight  canvasSize < cwidth
        ctx?.drawImage(video.el, (cwidth - canvasSize) / 2, 0, vheight, vheight, 0, 0, canvasSize, canvasSize)
      } else {
        // 容器 宽小于等于高 canvasSize=cwidth  canvasSize < cheight
        ctx?.drawImage(video.el, (cwidth - canvasSize) / 2, 0, cwidth, cwidth, 0, 0, canvasSize, canvasSize)
      }
      // const sh = canvasSize / vrate
      // if (sh < canvasSize) {
      //   const ncanvasSize = sh
      //   canvas.height = ncanvasSize
      //   canvas.width = ncanvasSize
      // }

      // ctx?.drawImage(video.el, video.width / 2 - cwidth / 2, (video.height - sh) / 2, canvasSize, sh, 0, 0, canvas.width, canvas.height)
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

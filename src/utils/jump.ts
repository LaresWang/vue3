// import router from "../router"
import type { TLoginPWDResParams } from "../types/user"
import message from "./message"
import { t } from "../locale"

let router: any
export const loadRouter = async () => {
  if (!router) {
    try {
      const r = await import("../router")
      router = r.default
      // return r
    } catch (e) {
      console.error("动态导入路由异常", e)
      // return null
    }
  }
}

const jump = async (path: string) => {
  if (router) {
    router.push(path)
  } else {
    await loadRouter()
    if (router) {
      router.push(path)
    }
  }
}

export const goLoginPage = () => {
  jump("/login")
}

export const loginFinished = function () {
  jump("/human/home")
}

export const goUserCenter = function () {
  jump("/user/set")
}

export const loginDone = (data: TLoginPWDResParams) => {
  if (data.token) {
    message(t("user.t25"))
    localStorage.setItem("token", data.token)
    localStorage.setItem("userkey", data.userKey)
    localStorage.setItem("userId", data.userId)
    loginFinished()
  }
}
/**
 * @name openUrlWithAElement 打开一个连接
 * 模拟a标签跳转，写这个方法主要是window.open(url)/location.href 这个方法在safari里被拦截了
 * @params
 *  url - [String] 赋值给a标签的href
 *  type - [String] 只能取值 _blank/_self/_parent/_top
 *      _blank	在新窗口中打开被链接文档。
 *      _self	默认。在相同的框架中打开被链接文档。
 *      _parent	在父框架集中打开被链接文档。
 *      _top	在整个窗口中打开被链接文档。
 */
type TAOpenType = "_blank" | "_self" | "_parent" | "_top"
type TAOpenOptions = {
  downLoad?: boolean
  name?: string
}
export const openUrlWithAElement = function (url: string, type: TAOpenType = "_self", options: TAOpenOptions = {}) {
  const start = url.slice(0, 4)
  if (start !== "http" && start !== "blob") {
    return
  }
  const a = document.createElement("a")
  a.style.display = "none"
  a.setAttribute("href", url)
  a.setAttribute("target", type)
  a.setAttribute("id", "a_jump")
  if (options.downLoad) {
    a.setAttribute("download", options.name || "")
  }
  //防止反复添加
  const current = document.getElementById("a_jump")
  if (current) {
    document.body.removeChild(current)
  }

  document.body.appendChild(a)
  a.click()
}

export const ICPBeianGov = function () {
  openUrlWithAElement("https://beian.miit.gov.cn/", "_blank")
}

export const PublicBeianGov = function () {
  openUrlWithAElement("https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011302007203", "_blank")
}

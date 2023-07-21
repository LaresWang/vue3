import axios from "axios"
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import type { IGenUrlOpts } from "../types/http"
import message from "../utils/message"
import { t, langKey } from "../locale"
import { goLoginPage } from "../utils/jump"
// 定义一个常见后端请求返回
type BaseApiResponse<T> = {
  code: number
  message: string
  sincereConnection?: string
  data: T
}
// 拓展 axios 请求配置，加入我们自己的配置
interface RequestOptions {
  // 是否全局展示请求 错误信息
  globalErrorMessage?: boolean
  // 是否全局展示请求 成功信息
  globalSuccessMessage?: boolean
  // 下载文件时的类型
  responseType?: "blob"
}
// 拓展自定义请求配置
interface ExpandAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  interceptorHooks?: InterceptorHooks
  requestOptions?: RequestOptions
}
// 拓展 axios 请求配置
interface ExpandInternalAxiosRequestConfig<D = any> extends InternalAxiosRequestConfig<D> {
  interceptorHooks?: InterceptorHooks
  requestOptions?: RequestOptions
}
// 拓展 axios 返回配置
interface ExpandAxiosResponse<T = any, D = any> extends AxiosResponse<T, D> {
  config: ExpandInternalAxiosRequestConfig<D>
}
export interface InterceptorHooks {
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  responseInterceptorCatch?: (error: any) => any
}

const defaultInterceptor: InterceptorHooks = {
  requestInterceptor(config) {
    localStorage.getItem("token") && (config.headers["Authorization"] = localStorage.getItem("token"))
    localStorage.getItem("sincereConnection") && (config.headers["Sincere-Connection"] = localStorage.getItem("sincereConnection"))

    let lang = localStorage.getItem(langKey)
    if (!lang || lang.includes("zh")) {
      lang = "zh-cn"
    } else if (lang.includes("en")) {
      lang = "en-us"
    } else {
      // 暂时只支持中英文
      lang = "en-us"
    }
    config.headers["Content-Language"] = lang
    config.headers["Accept-Language"] = lang

    return config
  },
  requestInterceptorCatch(err) {
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(err)
  },
  responseInterceptor(result) {
    // 因为 axios 返回不支持扩展自定义配置，需要自己断言一下
    const res = result as ExpandAxiosResponse
    if (res.status !== 200) return Promise.reject(res)

    if (res.config.requestOptions?.responseType === "blob") {
      // 文件下载接口，data类型为blob类型
      return {
        contentDisposition: decodeURIComponent(res.headers["content-disposition"] || ""),
        data: res.data
      }
    }

    if (res.data.code !== "200") {
      switch (res.data.code) {
        case "50006": // 无效的访问令牌	token不合法
        case "50007": // 访问令牌已过期 token已过期
          goLoginPage()
          break
        default:
          if (res.config.requestOptions?.globalErrorMessage) {
            message(res.data.msg, "error")
          }
      }

      return Promise.reject(res.data)
    }

    res.data.sincereConnection && localStorage.setItem("sincereConnection", res.data.sincereConnection)
    if (res.config.requestOptions?.globalSuccessMessage) {
      message(res.data.msg)
    }

    return res.data.data
  },
  responseInterceptorCatch(err) {
    // 这里用来处理 http 常见错误，进行全局提示
    // const mapErrorStatus = new Map([
    //   [400, '请求方式错误'],
    //   [401, '请重新登录'],
    //   [403, '拒绝访问'],
    //   [404, '请求地址有误'],
    //   [500, '服务器出错']
    // ])
    // const message = mapErrorStatus.get(err.response.status) || t("test")
    const isGlobal = err.config.requestOptions?.globalErrorMessage
    if (err.response) {
      if (err.response.status > 400 && err.response.status < 500) {
        // error.message: "Request failed with status code 404"
        // error.response.statusText: "Not Found"
        // msgError(error.message || error.response.statusText);
      } else if (err.response.status >= 500) {
        isGlobal && message(t("common.res_5xx"), "error")
      }
      return Promise.reject(err.response)
    }

    if (err.message) {
      isGlobal && message(err.message, "error")
      return Promise.reject(err.message)
    }

    return Promise.reject(err)
  }
}

export const genUrl = function (options: string | IGenUrlOpts): string {
  const isDev = import.meta.env.VITE_ENV === "development"
  if (typeof options === "string") {
    let url = options
    if (url.startsWith("http")) {
      return url
    }
    if (url.startsWith("/")) {
      url = url.slice(1)
    }

    if (isDev) {
      return "/api/" + url
    }

    return (import.meta.env.VITE_API_HOST || "") + "/api/" + url
  } else {
    if (!options.path) {
      return ""
    }
    if (options.path.startsWith("http")) {
      return options.path
    }
    let url = options.path
    if (url.startsWith("/")) {
      url = url.slice(1)
    }
    if (options.host) {
      return `${options.host}${options.prefix || "/"}${url}`
    }

    if (isDev) {
      return (options.prefix || "/api/") + url
    }

    return (import.meta.env.VITE_API_HOST || "") + (options.prefix || "/api/") + url
  }
}

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  private _instance: AxiosInstance
  // 默认配置
  private _defaultConfig: ExpandAxiosRequestConfig = {
    // baseURL: '',
    timeout: 30000,
    headers: {
      "Source-Client": "sincere.web"
      // "Source-Site": "sincere.realtime", // 走nginx配置的时候不需要这个头  走本地需要加上这个头
    },
    requestOptions: {
      globalErrorMessage: true,
      globalSuccessMessage: false
    }
  }
  private _interceptorHooks?: InterceptorHooks
  constructor(config: ExpandAxiosRequestConfig = {}) {
    // 使用axios.create创建axios实例
    this._instance = axios.create(Object.assign(this._defaultConfig, config))
    this._interceptorHooks = config?.interceptorHooks || defaultInterceptor
    this.setupInterceptors()
  }
  // 通用拦截，在初始化时就进行注册和运行，对基础属性进行处理
  private setupInterceptors() {
    this._instance.interceptors.request.use(this._interceptorHooks?.requestInterceptor, this._interceptorHooks?.requestInterceptorCatch)
    this._instance.interceptors.response.use(this._interceptorHooks?.responseInterceptor, this._interceptorHooks?.responseInterceptorCatch)
  }
  // 定义核心请求
  public request(config: ExpandAxiosRequestConfig): Promise<AxiosResponse> {
    // ！！！?? 注意：axios 已经将请求使用 promise 封装过了
    // 这里直接返回，不需要我们再使用 promise 封装一层
    return this._instance.request(config)
  }
  public get<T>(url: string | IGenUrlOpts, config?: ExpandAxiosRequestConfig): Promise<AxiosResponse<BaseApiResponse<T>>> {
    return this._instance.get(genUrl(url), config)
  }
  public post<T>(url: string | IGenUrlOpts, data: any = {}, config?: ExpandAxiosRequestConfig): Promise<T> {
    return this._instance.post(genUrl(url), data, config)
  }
  public put<T>(url: string | IGenUrlOpts, data?: any, config?: ExpandAxiosRequestConfig): Promise<T> {
    return this._instance.put(genUrl(url), data, config)
  }
  public delete<T>(url: string | IGenUrlOpts, config?: ExpandAxiosRequestConfig): Promise<T> {
    return this._instance.delete(genUrl(url), config)
  }
}

const defaultRequest = new Request()

export default defaultRequest

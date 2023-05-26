import axios, { type CreateAxiosDefaults, type AxiosRequestConfig } from "axios";
import type { IGenUrlOpts, IGetParams, IPostParams, IReqConfig } from "../types/http"
import { ElMessage } from "element-plus";
import { t } from "../locale";

const config: CreateAxiosDefaults = {
  timeout: 3000,
  headers: {
    "Source-Client": "sincere.web",
    // "Source-Site": "sincere.realtime", // 走nginx配置的时候不需要这个头  走本地需要加上这个头
  }
}

const instance = axios.create(config);

instance.interceptors.request.use(
  //这里添加token
  async (config) => {
    // console.log(process.env);
    // if (process.env.VUE_APP_LANUCH === "local") {
    //   config.headers["Source-Site"] = "sincere.realtime"; // 走nginx配置的时候不需要这个头  走本地需要加上这个头
    // }

    localStorage.getItem("token") && (config.headers["Authorization"] = localStorage.getItem("token"));
    localStorage.getItem("sincereConnection") && (config.headers["Sincere-Connection"] = localStorage.getItem("sincereConnection"));
    config.headers["Content-Language"] = localStorage.getItem("lang") || "zh-cn";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    console.log(response);

    if (response.config.responseType === "blob") {
      // 文件下载接口，data类型为blob类型
      if (response.status === 200) {
        return {
          contentDisposition: decodeURIComponent(response.headers["content-disposition"] || ""),
          data: response.data,
        };
      } else {
        return Promise.reject(response);
      }
    }
    // console.log(i18n.global.t("test"))

    console.log(t("test"))
    const errFun = ElMessage.error;
    const code = response.data?.code;
    if (code === "200") {
      response.data.sincereConnection && localStorage.setItem("sincereConnection", response.data.sincereConnection);
      return response.data.data;
    }
    // http://wiki.voneyun.com/pages/viewpage.action?pageId=16680308

    switch (code) {
      case "50006": // 无效的访问令牌	token不合法
      case "50007": // 访问令牌已过期 token已过期
        {
          // if (response.config.url.includes("/user/logout")) {
          //   // 用户主动点击退出登录后再登录的话不需要跳转到登录前的页面
          //   goToLoginPage({
          //     noneedBack: true,
          //   });
          // } else {
          //   localStorage.removeItem("active");
          //   goToLoginPage();
          // }
        }
        break;

      default:
        errFun(response.data.msg);
    }
    return Promise.reject(response.data);
    // return new Error(response.data.msg);

    // 对响应数据做点什
    // if (code == "500") {
    //   errFun(t(""));
    //   return Promise.reject();
    // }
  },

  function (error) {
    if (error.config.params?.fallback) {
      return Promise.reject(error);
    }
    console.log(error);
    if (error.response.status > 400 && error.response.status < 500) {
      // error.message: "Request failed with status code 404"
      // error.response.statusText: "Not Found"
      // msgError(error.message || error.response.statusText);
    } else if (error.response.status >= 500) {
      // msgError(t(""));
    }

    return Promise.reject(new Error(error));
  }
);

export const httpInstance = instance;



const genUrl = function (path = "", options:IGenUrlOpts = {}): string {
  if (path.startsWith("http")) {
    return path;
  }
  if (options.host) {
    return `${options.host}${options.prefix || "/"}${path}`;
  }
  return (import.meta.env.VITE_API_HOST || "") + (options.prefix || "/api/realtime/") + path;
  // 调试
  // return (process.env.VUE_APP_LANUCH ? "" : process.env.VUE_APP_API_HOST) + "/realtime/" + path;
};

const getHandler = async (url: string, params: IGetParams = {}, options: AxiosRequestConfig = {}) => {
  return instance.request({
    url: url,
    method: "get",
    params: {
      ...params,
      t: Date.now(),
    },
    ...options,
  });
};

const postHandler = async (url: string, data:IPostParams = {}, options: AxiosRequestConfig = {}) => {
  const params = {
    url: url,
    method: "post",
    data,
    ...options,
  };
  return instance.request(params);
};

export const httpGet = async <T, K>(path: string, data:IGetParams = {}, options: IReqConfig = {}): Promise<T|K> => {
  try {
    const url = genUrl(path, options)
    delete options.host
    delete options.prefix
    const res = await getHandler(url, data, options)
    return res as T
  } catch (e) {
    return e as K
  }
}

export const httpPost = async <T, K>(path: string, data:IPostParams = {}, options: IReqConfig = {}): Promise<T|K> => {
  try {
    const url = genUrl(path, options)
    delete options.host
    delete options.prefix
    const res = await postHandler(url, data, options)
    return res as T
  } catch (e) {
    return e as K
  }
}
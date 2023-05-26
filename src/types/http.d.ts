import type { AxiosRequestConfig } from "axios";

export interface IGenUrlOpts {
  host?: string
  prefix?: string
}

export interface IReqConfig extends AxiosRequestConfig, IGenUrlOpts {

}

export interface IGetParams {
  [x: string]: string|number
}
export interface IPostParams {
  [x: string]: any
}

export interface IReqGetFun<T, K>{
  (url: string, data:IGetParams, options: AxiosRequestConfig): T|K
}

export type IReqPostFun<T, K> = (url: string, data:IGetParams, options: AxiosRequestConfig) => T|K;

export type IResRegularError = {
  code: string
  msg: string
}
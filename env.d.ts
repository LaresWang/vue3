/// <reference types="vite/client" />
declare module 'webrtcsdk_new';
declare const APP_ENV: string;

type TGeetestParams = {
  captchaId: string,
  product: string
}
interface IGeetestCallback {
  (arg: any): void
}

interface Window {
  initGeetest4: (params:TGeetestParams, cb: IGeetestCallback )=>void
};



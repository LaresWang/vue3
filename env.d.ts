/// <reference types="vite/client" />
declare module "webrtcsdk_new"
declare const APP_ENV: string

type TGeetestParams = {
  captchaId: string
  product: string
}
interface IGeetestCallback {
  (arg: any): void
}

interface Window {
  initGeetest4: (params: TGeetestParams, cb: IGeetestCallback) => void
  rtc: {
    closeApp: (code: number, reason: string) => void
    init: () => void
    setConfig: (options: any) => void
    setPlayerInfo: (options: { info: string; timestamp: string }) => void
    sendDataToApp: (data: string, messageType?: number) => void
    setOperateAuth: (status: boolean) => void
    sendRawKeyboardData: (type: string, options: any) => void
    sendRawMouseData: (type: string, options: any) => void
  }
}

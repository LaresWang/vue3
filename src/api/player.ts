import { httpPost, httpGet, getResData } from "./http";
import type {TResRegularError} from "../types/http"
import type {THeatBeatReqParams, THeatBeatResParams} from "../types/player"

export const heartBeat = function (params: THeatBeatReqParams): Promise<THeatBeatResParams|undefined>{
  return httpGet<THeatBeatResParams, TResRegularError>("instance/heartbeat", params).then(data => {
    return getResData<THeatBeatResParams>(data, "code", true)
  });
};
import { ref } from "vue"
import { defineStore } from "pinia"
import { getLaunchStatus } from "@/api/player"
import type { TInterval } from "@/types"
import type { ELaunchStatus } from "@/types/player"
import { ELaunchStatus as LaunchStatus } from "@/types/player"

export const useLaunchInitInfosStore = defineStore("launchInitInfos", () => {
  const humanId = ref("") // 数字人ID
  const humanInstanceId = ref("") // 数字人实例ID
  const appInstanceId = ref("") // UE 应用实例ID

  const setHumanIds = (instanceId: string, hid: string) => {
    console.log("setHumanIds", instanceId, hid)
    humanInstanceId.value = instanceId
    humanId.value = hid
  }

  const setAppInstanceId = (id: string) => {
    console.log("setAppInstanceId", id)
    appInstanceId.value = id
  }

  return { humanId, humanInstanceId, appInstanceId, setHumanIds, setAppInstanceId }
})

export const useLaunchStatusStore = defineStore("launchStatus", () => {
  let timmer: TInterval = 0
  const status = ref<ELaunchStatus>()

  const launchInitInfosStore = useLaunchInitInfosStore()

  const start = () => {
    console.log("开始循环查询启动状态")
    timmer = setInterval(async () => {
      const res = await getLaunchStatus({
        instanceId: launchInitInfosStore.humanInstanceId,
        humanId: launchInitInfosStore.humanId
      })
      status.value = res.status
      if (res.channelInstanceId && !launchInitInfosStore.appInstanceId) {
        launchInitInfosStore.setAppInstanceId(res.channelInstanceId)
      }
      if (res.status !== LaunchStatus.Launching) {
        stop()
      }
    }, 5000)
  }

  const stop = () => {
    timmer && clearInterval(timmer)
  }

  return { status, start, stop }
})

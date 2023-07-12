import { ref } from "vue"
import { defineStore } from "pinia"
import { getLaunchStatus } from "@/api/player"
import type { TInterval } from "@/types"
import type { ELaunchStatus } from "@/types/player"
import { ELaunchStatus as LaunchStatus } from "@/types/player.d"
import type { THumanModelInfos } from "@/types/human"

export const useLaunchInitInfosStore = defineStore("launchInitInfos", () => {
  const humanId = ref("") // 数字人ID
  const humanNo = ref("") // 数字人No
  const previewUrl = ref("") // 数字人No
  const humanInstanceId = ref("") // 数字人实例ID
  const appInstanceId = ref("") // UE 应用实例ID

  const setHumanInfos = (instanceId: string, appInstId: string, info: THumanModelInfos) => {
    console.log("setHumanIds", instanceId, info)
    humanInstanceId.value = instanceId
    appInstanceId.value = appInstId
    humanId.value = info.humanId
    humanNo.value = info.humanNo
    previewUrl.value = info.previewUrl
  }

  const setAppInstanceId = (id: string) => {
    console.log("setAppInstanceId", id)
    appInstanceId.value = id
  }

  return { humanId, humanNo, previewUrl, humanInstanceId, appInstanceId, setHumanInfos, setAppInstanceId }
})

export const useLaunchStatusStore = defineStore("launchStatus", () => {
  let timmer: TInterval = 0
  const status = ref<ELaunchStatus>()
  const canInteract = ref(false)

  const launchInitInfosStore = useLaunchInitInfosStore()

  const start = () => {
    // 清掉可能存在的旧循环
    stop()
    console.log("开始循环查询启动状态")
    timmer = setInterval(async () => {
      const isInPlayerPage = location.pathname === "/human/home"
      if (!isInPlayerPage) {
        stop()
        return
      }

      const res = await getLaunchStatus({
        instanceId: launchInitInfosStore.humanInstanceId,
        humanId: launchInitInfosStore.humanId
      })
      status.value = res.status
      // if (res.channelInstanceId && !launchInitInfosStore.appInstanceId) {
      //   launchInitInfosStore.setAppInstanceId(res.channelInstanceId)
      // }
      if (res.status !== LaunchStatus.Launching) {
        stop()
      }
    }, 5000)
  }

  const stop = () => {
    timmer && clearInterval(timmer)
  }

  const ready = () => {
    canInteract.value = true
  }

  return { status, canInteract, start, stop, ready }
})

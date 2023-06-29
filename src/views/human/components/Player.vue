<template>
  <div class="player-wrapper">
    <div id="player">
      <!-- <video id="streamingVideo"></video> -->
    </div>
    <ShortCut />
  </div>
</template>
<script setup lang="ts">
  import { watchEffect } from "vue"
  import WEBRTCSDK from "webrtcsdk_new"
  import { getBrowserUUID, getCiphertext } from "@/utils/tools"
  import { PLAYER_TYPE } from "@/utils/const"
  import { useLaunchInitInfosStore, useLaunchStatusStore } from "@/stores/player"
  import { useIOMethodStore } from "@/stores/io"
  import useRtcHandlerStore from "@/stores/rtc"
  import { usePlayerHandlers } from "@/hooks/human/player"
  import { ELaunchStatus, type TRtcSDK } from "@/types/player.d"

  import ShortCut from "./ShortCut.vue"

  const launchInitInfosStore = useLaunchInitInfosStore()
  const launchStatusStore = useLaunchStatusStore()
  const rtcHandlerStore = useRtcHandlerStore()
  const IOMethodStore = useIOMethodStore()

  const { connectStatus, canStartWebrtc, onConnectStatusChange, onStatsChange, onReceiveData, onRtcBeforeSendMessage, onRtcRecieveMessage } =
    usePlayerHandlers()

  let sdk: TRtcSDK
  const uuid = getBrowserUUID()

  watchEffect(() => {
    if (launchInitInfosStore.humanInstanceId) {
      console.log("humanInstanceId======", launchInitInfosStore.humanInstanceId)
      launchStatusStore.start()
    }
  })

  watchEffect(() => {
    const status = connectStatus.value
    console.log(status)
    if (status && ["done", "close", "error", "dcclosed"].includes(status)) {
      launchStatusStore.stop()
    }
    if (status === "done") {
      // 可以直接给UE发信息了
      // sdk.sendDataToApp(data)
    }
  })

  watchEffect(() => {
    if (launchStatusStore.status === ELaunchStatus.Fail || launchStatusStore.status === ELaunchStatus.Close) {
      sdk.closeApp(4009, "启动实例失败后主动关闭wesocket")
    }
  })

  watchEffect(() => {
    console.log(launchInitInfosStore.appInstanceId, connectStatus)
    if (launchInitInfosStore.appInstanceId && connectStatus.value === "wsconnect") {
      console.log("appInstanceId======", launchInitInfosStore.appInstanceId)
      // 告知信令应用实例id，信令端获取应用所在的虚拟机ip和端口信息
      setPlayerInfo(launchInitInfosStore.appInstanceId)
    }
  })

  watchEffect(() => {
    if (canStartWebrtc.value) {
      // 开始建立webrtc链接
      sdk.init()
    }
  })

  const setWebrtcConfig = () => {
    // 事件初始化
    // 注意： keyboardEvent/mouseEvent/touchEvent/gamepadEvent 值为falsy条件时走默认注册事件，值为空对象的时不注册事件
    // unity支持细粒度的事件控制  ue暂不支持
    let keyboardEvent = {
      keyup: true,
      keydown: true
    }
    let mouseEvent = {
      click: true,
      mousedown: true,
      mouseup: true,
      mousemove: true,
      wheel: true
    }
    let touchEvent = {}
    let gamepadEvent = {}

    sdk.setConfig({
      canChangeDisplayToFillWindow: true,
      interactOptions: {
        controlScheme: 2,
        showCursor: true,
        // 控制交互事件的注册 现在只有unity代码实现此功能
        keyboardEvent,
        mouseEvent,
        touchEvent,
        gamepadEvent
      },
      autoCloseWithoutInteract: {
        duration: -1
      }
    })
  }

  const presetWebrtc = () => {
    let url = `${import.meta.env.VITE_SIGNAL_HOST.replace("http", "ws")}/player/home?sid=${uuid}&linkType=${PLAYER_TYPE}`

    if (location.search.includes("&t=")) {
      url += "&t=123"
    }

    sdk = new WEBRTCSDK({
      windowBoxSelector: ".player-wrapper",
      videoCoverType: "coverHeight",
      // autoPlayAudio: false,
      wsAddress: url,
      ioType: IOMethodStore.method,
      onStatsChange: onStatsChange,
      onConnectStatusChange: onConnectStatusChange,
      onReceiveDataCallback: onReceiveData,
      onRtcBeforeSendMessage: onRtcBeforeSendMessage,
      onRtcRecieveMessage: onRtcRecieveMessage
    })

    setWebrtcConfig()
  }

  presetWebrtc()

  const setPlayerInfo = (appInstanceId: string) => {
    const infos = {
      linkType: PLAYER_TYPE,
      appType: 1,
      uuid: uuid, // uuid是当前窗口的唯一标识字段，刷新当前窗口不变化
      instanceId: appInstanceId
    }
    console.log(infos)
    const t = Date.now() + ""
    const ciphertext = getCiphertext(JSON.stringify(infos), t)

    sdk.setPlayerInfo({
      info: encodeURIComponent(ciphertext),
      timestamp: t
    })

    rtcHandlerStore.setRtc(sdk)
  }
</script>
<style lang="less">
  .player-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    #player {
      width: 100%;
      height: 100%;
      position: absolute;
      video {
        width: 100%;
        height: 100%;
        position: absolute;
      }
    }
  }
</style>

<template>
  <div
    class="player-wrapper"
    id="video-container"
  >
    <div id="player">
      <!-- <video id="streamingVideo"></video> -->
    </div>
    <ShortCut v-if="loadingProgress === 100" />
    <div
      v-if="loadingProgress < 100"
      class="loading-wrapper flex-center"
    >
      <div
        class="fix-loading-bg-pic"
        ref="loadingBgPic"
        :style="loadingBgStyle"
      ></div>
      <div class="loading-inner">
        <div class="flex-center">
          <el-icon><Loading /></el-icon>
        </div>
        <div class="tip-text">{{ $t("player.t1") }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect, watch, onMounted } from "vue"
  import { Loading } from "@element-plus/icons-vue"
  import WEBRTCSDK from "webrtcsdk_new"
  import { getBrowserUUID, getCiphertext } from "@/utils/tools"
  import { PLAYER_TYPE } from "@/utils/const"
  import { useLaunchInitInfosStore, useLaunchStatusStore } from "@/stores/player"
  import { useSelectedModelInfoStore } from "@/stores/human"
  import { useIOMethodStore } from "@/stores/io"
  import useRtcHandlerStore from "@/stores/rtc"
  import useBgPicSize from "@/hooks/bgPicSize"
  import { usePlayerHandlers } from "@/hooks/human/player"
  import { ELaunchStatus } from "@/types/player.d"
  import type { TConnectStatus, TRtcSDK } from "@/types/player"
  import type { TObj } from "@/types"

  import ShortCut from "./ShortCut.vue"

  // const bgImg = new URL("../../../assets/imgs/list_default_pic.png", import.meta.url).href

  const launchInitInfosStore = useLaunchInitInfosStore()
  const selectedModelInfoStore = useSelectedModelInfoStore()
  const launchStatusStore = useLaunchStatusStore()
  const rtcHandlerStore = useRtcHandlerStore()
  const IOMethodStore = useIOMethodStore()

  const loadingBgPic = ref<HTMLElement>()
  const loadingBgStyle = ref<TObj>({})

  useBgPicSize(loadingBgPic, 975 / 758)

  const {
    connectStatus,
    canStartWebrtc,
    onConnectStatusChange,
    onStatsChange,
    onReceiveData,
    onRtcBeforeSendMessage,
    onRtcRecieveMessage,
    loadingProgress
  } = usePlayerHandlers()

  let sdk: TRtcSDK
  const uuid = getBrowserUUID()

  watch(
    [() => launchInitInfosStore.humanInstanceId, () => launchInitInfosStore.previewUrl],
    ([id, url]) => {
      if (id) {
        console.log("humanInstanceId======", id)
        launchStatusStore.start()
      }
      if (url) {
        loadingBgStyle.value.backgroundImage = `url(${url}?t=${Date.now()})`
        // loadingBgStyle.value.backgroundImage = `url(${bgImg})`
      }
    },
    {
      immediate: true
    }
  )

  watch(
    () => connectStatus.value,
    (val: TConnectStatus | undefined) => {
      // const status = connectStatus.value
      console.log(val)
      if (val && ["done", "close", "error", "dcclosed"].includes(val)) {
        launchStatusStore.stop()
      }
      if (val === "done") {
        // 可以直接给UE发信息了
        // sdk.sendDataToApp(data)
        rtcHandlerStore.ready()
        launchStatusStore.ready()

        selectedModelInfoStore.setSelectedModelInfo(
          {
            humanId: selectedModelInfoStore.info.humanId,
            humanName: selectedModelInfoStore.info.humanName,
            humanCatg: selectedModelInfoStore.info.humanCatg,
            humanNo: selectedModelInfoStore.info.humanNo,
            gender: selectedModelInfoStore.info.gender
          },
          {
            sendDirect: true
          }
        )
      }
    },
    {
      immediate: true
    }
  )

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
    .loading-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
      background-color: var(--c-black-0);
      overflow: hidden;
      .fix-loading-bg-pic {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 5;
        opacity: 0.5;
        background-position: center center;
        background-repeat: no-repeat;
        filter: blur(15px);
      }
      .loading-inner {
        position: relative;
        z-index: 10;
        .el-icon {
          width: 124px;
          height: 124px;
          color: var(--c-gray-1);
          svg {
            width: 100%;
            height: 100%;
            animation: rotate linear 5s infinite;
          }
        }
        .tip-text {
          width: 100%;
          margin-top: 56px;
          font-size: 14px;
          font-weight: 500;
          color: var(--c-white-1);
        }
      }
    }
  }
</style>

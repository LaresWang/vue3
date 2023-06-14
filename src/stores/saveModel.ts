// 数字人保存
import { ref } from "vue"
import { defineStore } from "pinia"
import { HumanModelCatgs } from "@/utils/const"
import { saveHumanModel } from "@/api/human"
import { useSelectedModelInfoStore } from "@/stores/human"
import { useBreadcrumbMenusStore } from "@/stores/menus"
import { EModelCatg } from "@/types/human.d"

import { getImgDataFromVideo, transferB64toBlob } from "@/utils/screenShot"

export default defineStore("saveHumanModel", () => {
  const isSaving = ref(false)
  const result = ref("")
  const param = new FormData()
  const selectedModelInfoStore = useSelectedModelInfoStore()
  const breadcrumbMenusStore = useBreadcrumbMenusStore()

  const startSaving = async (previewImgData: Blob) => {
    param.append("humanId", selectedModelInfoStore.info.humanId)
    param.append("previewUrl", previewImgData)

    try {
      const res = await saveHumanModel(param)
      console.log("保存成功", res)
      result.value = "ok"
      jumpModelList()
    } catch (e) {
      console.log("保存失败")
      result.value = "error"
    } finally {
      isSaving.value = false
    }
  }

  const startScreenShot = () => {
    const b64 = getImgDataFromVideo("streamingVideo")
    if (!b64) {
      console.log("获取数据异常")
      isSaving.value = false
      return
    }

    const blobData = transferB64toBlob(b64)

    startSaving(blobData)
  }

  const jumpModelList = () => {
    // 显示我的数字人tab
    const item = HumanModelCatgs.find((info) => info.value === EModelCatg.User)
    breadcrumbMenusStore.updateRootMenu({
      ...item!,
      canJump: true
    })
    // 清楚编辑前选中的模型，加载列表后再发送指令显示 第一个模型
    selectedModelInfoStore.clearSelectedModelInfo()
  }

  const save = () => {
    isSaving.value = true
    startScreenShot()
  }

  const resetResult = () => {
    result.value = ""
  }

  return { isSaving, result, resetResult, save }
})

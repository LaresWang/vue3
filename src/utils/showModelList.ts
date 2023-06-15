import { HumanModelCatgs } from "./const"
import type { EModelCatg } from "@/types/human"
import { useBreadcrumbMenusStore } from "@/stores/menus"
import { useSelectedModelInfoStore } from "@/stores/human"

export const showModelLists = (catg: EModelCatg) => {
  // 显示我的数字人tab
  const selectedModelInfoStore = useSelectedModelInfoStore()
  const breadcrumbMenusStore = useBreadcrumbMenusStore()

  // 清楚编辑前选中的模型，加载列表后再发送指令显示 第一个模型
  selectedModelInfoStore.clearSelectedModelInfo()

  const item = HumanModelCatgs.find((info) => info.value === catg)
  breadcrumbMenusStore.updateRootMenu({
    ...item!,
    canJump: true
  })
}

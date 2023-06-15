import { HumanModelCatgs } from "./const"
import { EModelCatg } from "@/types/human.d"
import { useBreadcrumbMenusStore } from "@/stores/menus"
import { useSelectedModelInfoStore } from "@/stores/human"

export const showUserModelLists = () => {
  // 显示我的数字人tab
  const selectedModelInfoStore = useSelectedModelInfoStore()
  const breadcrumbMenusStore = useBreadcrumbMenusStore()
  const item = HumanModelCatgs.find((info) => info.value === EModelCatg.User)
  breadcrumbMenusStore.updateRootMenu({
    ...item!,
    canJump: true
  })
  // 清楚编辑前选中的模型，加载列表后再发送指令显示 第一个模型
  selectedModelInfoStore.clearSelectedModelInfo()
}

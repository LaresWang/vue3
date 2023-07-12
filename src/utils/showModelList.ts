import { HumanModelCatgs } from "./const"
import type { EModelCatg } from "@/types/human"
import { useBreadcrumbMenusStore } from "@/stores/menus"

export const showModelLists = (catg: EModelCatg) => {
  const breadcrumbMenusStore = useBreadcrumbMenusStore()

  const item = HumanModelCatgs.find((info) => info.value === catg)
  breadcrumbMenusStore.updateRootMenu({
    ...item!,
    canJump: true
  })
}

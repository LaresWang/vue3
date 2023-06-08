import { reactive } from "vue"
import { defineStore } from "pinia"
import type { TBreadcrumbMenus, TEditHumanMenus } from "../types/menus"

const useBreadcrumbMenus = defineStore("breadcrumbMenus", () => {
  const menus = reactive<TBreadcrumbMenus[]>([])
  const addMenus = (menu: TBreadcrumbMenus) => {
    menus.push(menu)
  }

  const clearMenus = () => {
    menus.length = 0
  }

  return { menus, addMenus, clearMenus }
})

const useEidtHumanMenus = defineStore("editHumanMenus", () => {
  const menus = reactive<TEditHumanMenus[]>([])
  const addMenus = (menu: TEditHumanMenus) => {
    menus.push(menu)
  }

  const clearMenus = () => {
    menus.length = 0
  }

  return { menus, addMenus, clearMenus }
})

export { useBreadcrumbMenus, useEidtHumanMenus }

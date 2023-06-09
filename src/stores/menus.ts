import { reactive } from "vue"
import { defineStore } from "pinia"
import type { TBreadcrumbMenu, TEditHumanMenu } from "../types/menus"
import { v4 as uuid } from "uuid"

const useBreadcrumbMenus = defineStore("breadcrumbMenus", () => {
  const breadMenus = reactive<TBreadcrumbMenu[]>([])
  const addBreadMenu = (menu: TBreadcrumbMenu) => {
    if (!menu.id) {
      menu.id = uuid()
    }
    if (!breadMenus.length) {
      breadMenus.push(menu)
    }
    // else {
    //   let parent = ""
    //   breadMenus.forEach((item) => (parent += item.value + "-"))
    //   menu.parent = parent.slice(0, -1)
    // }
    breadMenus.push(menu)
  }
  const updateRootMenu = (menu: TBreadcrumbMenu) => {
    clearBreadMenus()
    addBreadMenu(menu)
  }
  const clearBreadMenus = () => {
    breadMenus.length = 0
  }

  const jumpPrevMenu = (idx: number) => {
    if (idx < breadMenus.length - 1) {
      breadMenus.splice(0, idx)
    }
  }

  return { breadMenus, addBreadMenu, jumpPrevMenu, updateRootMenu }
})

const useEidtHumanMenus = defineStore("editHumanMenus", () => {
  const editMenus = reactive<TEditHumanMenu[]>([])
  const addEditMenus = (menus: TEditHumanMenu | TEditHumanMenu[]) => {
    if (Array.isArray(menus)) {
      menus.forEach((menu) => {
        if (!menu.id) {
          menu.id = uuid()
        }
        editMenus.push(menu)
      })
    } else {
      if (!menus.id) {
        menus.id = uuid()
      }
      editMenus.push(menus)
    }
  }

  const clearEditMenus = () => {
    editMenus.length = 0
  }

  return { editMenus, addEditMenus, clearEditMenus }
})

export { useBreadcrumbMenus, useEidtHumanMenus }

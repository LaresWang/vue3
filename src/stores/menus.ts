import { reactive, ref } from "vue"
import { defineStore } from "pinia"
import type { TBreadcrumbMenu, TEditHumanMenu, EEditCompName } from "../types/menus"
import { v4 as uuid } from "uuid"

const useBreadcrumbMenus = defineStore("breadcrumbMenus", () => {
  const breadMenus = reactive<TBreadcrumbMenu[]>([])
  const addBreadMenu = (menu: TBreadcrumbMenu) => {
    if (!menu.id) {
      menu.id = uuid()
    }
    // if (!breadMenus.length) {
    //   breadMenus.push(menu)
    // }
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
    const len = breadMenus.length
    if (idx < len - 1) {
      breadMenus.splice(idx + 1, len - (idx + 1))
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

const useSelectedEditCompId = defineStore("editCompId", () => {
  const selectedCompId = ref<EEditCompName>()
  const setSelectId = (id: EEditCompName) => {
    selectedCompId.value = id
  }

  return { selectedCompId, setSelectId }
})

export { useBreadcrumbMenus, useEidtHumanMenus, useSelectedEditCompId }

import { reactive, ref, computed } from "vue"
import { defineStore } from "pinia"
import type { TBreadcrumbMenu, TEditHumanMenu, EEditCompName } from "../types/menus"
import { v4 as uuid } from "uuid"

const useBreadcrumbMenusStore = defineStore("breadcrumbMenus", () => {
  const breadMenus = ref<TBreadcrumbMenu[]>([])

  const currentModelCat = computed(() => breadMenus.value[0]?.value)

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
    breadMenus.value.push(menu)
    console.log(breadMenus.value, 33333)
  }
  const updateRootMenu = (menu: TBreadcrumbMenu) => {
    clearBreadMenus()
    addBreadMenu(menu)
  }
  const clearBreadMenus = () => {
    breadMenus.value.length = 0
  }

  const jumpPrevMenu = (idx: number) => {
    const len = breadMenus.value.length
    if (idx < len - 1) {
      breadMenus.value.splice(idx + 1, len - (idx + 1))
    }
  }

  return { breadMenus, currentModelCat, addBreadMenu, jumpPrevMenu, updateRootMenu }
})

const useEidtHumanMenusStore = defineStore("editHumanMenus", () => {
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

const useSelectedEditCompNameStore = defineStore("editCompId", () => {
  const selectedCompName = ref<EEditCompName>()
  const eidtHumanMenusStore = useEidtHumanMenusStore()
  const setSelectCompName = (id: EEditCompName) => {
    selectedCompName.value = id
  }
  const initSelectCompName = () => {
    const menus = eidtHumanMenusStore.editMenus
    if (menus.length) {
      const selectedmenu = menus.find((menu) => menu.defaultSelected)
      selectedCompName.value = selectedmenu?.value || menus[0].value
    }
  }
  return { selectedCompName, setSelectCompName, initSelectCompName }
})

export { useBreadcrumbMenusStore, useEidtHumanMenusStore, useSelectedEditCompNameStore }

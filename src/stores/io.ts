import { ref } from "vue"
import { defineStore } from "pinia"
import type { EIOMethod } from "@/types/player"
import { EIOMethod as IOMethod } from "@/types/player.d"

export const useIOMethodStore = defineStore("IOMethod", () => {
  const method = ref<EIOMethod>(IOMethod.Api)

  const setMethod = (way: EIOMethod) => {
    method.value = way
  }

  return { method, setMethod }
})

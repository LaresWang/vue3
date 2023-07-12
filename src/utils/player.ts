import { useLaunchStatusStore } from "@/stores/player"
import message from "./message"

export const canInteract = (): boolean => {
  const launchStatusStore = useLaunchStatusStore()
  if (!launchStatusStore.canInteract) {
    message("数字人未加载完成, 暂不能操作", "error")
    return false
  }

  return true
}

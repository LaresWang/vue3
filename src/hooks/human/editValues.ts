import useRecordEditStore from "@/stores/recordEdit"
import type { TObjGeneric } from "@/types"
import { EBodyParts } from "@/types/human.d"

export default () => {
  const recordEditStore = useRecordEditStore()

  const getHeaderEditValues = (humanNo: string) => {
    const res: TObjGeneric<number> = {}
    const record = recordEditStore.getValidWholeEditInfo(humanNo)
    const header = record[EBodyParts.Header]
    if (header && header.microAdjust?.length) {
      header.microAdjust.forEach((item) => {
        res[item.commandId] = +item.commandValue
      })
    }

    return res
  }

  return { getHeaderEditValues }
}

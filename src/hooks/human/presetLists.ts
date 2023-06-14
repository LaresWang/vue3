import type { Required2Optional } from "@/types"
import type { TEmotionParams, TActionParams, TPresetListInfo } from "@/types/human"

export const formatPresetListsData = <T extends Required2Optional<TEmotionParams, "faceId"> & Required2Optional<TActionParams, "actionId">>(
  infos: T[]
): TPresetListInfo[] => {
  const res: TPresetListInfo[] = []
  infos.forEach((info) => {
    res.push({
      id: (info.actionId || info.faceId)!,
      previewUrl: info.previewUrl,
      name: info.name,
      cmdCode: info.name // TODO 字段待定
    })
  })
  return res
}

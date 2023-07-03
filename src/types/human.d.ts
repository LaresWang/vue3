export enum EModelCatg {
  Buildin = 0, // 平台内置数字人
  User = 1 // 用户创建的数字人
}

export enum EBodyParts {
  Header = "header" // 暂时只有一个头部可编辑
}

export enum EEmotionCatg {
  Static = 0, // 静态表情
  Dynamic = 1 // 动态表情
}

export enum EGender {
  Male = 0,
  Female
}

export enum EOperateModelType {
  Delete = "delete", // 删除数字人
  Copy = "copy", // 复制数字人
  Save = "save" //保存数字人
}
/**
 *humanId	string	数字人ID
humanNo	string	数字人编号
humanName	string	数字人名称
gender	int	性别 0-男 1-女
genderName	string	性别名称
previewUrl	string	预览图地址
ceratedOn	string	创建时间
updatedOn	string	最后修改时间
 */
export type THumanModelInfos = {
  humanId: string
  humanNo: string
  humanName: string
  gender: 0 | 1
  genderName: string
  previewUrl: string
  ceratedOn: string
  updatedOn: string
}

export type TPageReqParams = {
  pageNo: number
  pageSize: number
}

export type TUserHUmanResParams = {
  pageNo: number
  pageSize: number
  totalPage: number
  totalRow: number
  rows: THumanModelInfos[]
}

// category 0-静态 1-动态
export type TEmotionCatg = {
  category: EEmotionCatg
  gender: EGender
}

export type TActionReqParams = {
  gender: EGender
}

/**
 * faceId	string	表情ID
previewUrl	string	预览
name	string	表情名称
 */
export type TEmotionParams = {
  faceId: string
  previewUrl: string
  name: string
  code: string
}

export type TActionParams = {
  actionId: string
  previewUrl: string
  name: string
  code: string
}

export type TModifyHumanNameReqParams = {
  humanId: string
  name: string
}

export type TModifyHumanNameResParams = {
  humanId: string
}

export type TSaveHumanModelResParams = TModifyHumanNameResParams

export type TDeleteHumanReqParams = Pick<TModifyHumanNameReqParams, "humanId"> & {
  humanNo: string
  platform: EModelCatg
  taskId: string
}

export type TDeleteHumanResultReqParams = Pick<TModifyHumanNameReqParams, "humanId"> & { result: boolean }

export type TCopyHumanReqParams = {
  sourceHumanId: string
  source: EModelCatg
  sourceHumanNo: string
  taskId: string
}

export type TCopyHumanResParams = {
  humanId: string
  humanNo: string
}

export type TCopyHumanResultReqParams = TDeleteHumanResultReqParams & {
  assetFile?: string
  previewUrl?: FormData
}

/**编辑数字人配置 VVVVV*/
/*
 const demo = {
  body_parts: [
    {
      name: "捏脸",
      code: "001",
      detail: [
        {
          name: "头型",
          code: "001-001",
          detail: [
            {
              name: "整体",
              code: "001-001-001",
              detail: [
                {
                  name: "高度",
                  code: "001-001-001-002",
                  setting_mode: 0,
                  cmd_code: "CMD01002",
                  range: {
                    left_value: "-1",
                    right_value: "1",
                    inclusive_left_range: "1",
                    inclusive_right_range: "1",
                    scale: 8
                  }
                }
              ]
            }
          ]
        },
        {
          name: "面部",
          code: "001-002",
          detail: [
            {
              name: "眼睛",
              code: "001-002-011",
              detail: [
                {
                  name: "整体",
                  code: "001-002-011-001",
                  detail: [
                    {
                      name: "眼睛大小",
                      code: "001-002-011-001-005",
                      setting_mode: 0,
                      cmd_code: "CMD01061",
                      range: {
                        left_value: "-1",
                        right_value: "1",
                        inclusive_left_range: "",
                        inclusive_right_range: "",
                        scale: 8
                      }
                    }
                  ]
                }
              ]
            },
            {
              name: "耳朵",
              code: "001-002-012",
              detail: [
                {
                  name: "整体",
                  code: "001-002-012-001",
                  detail: [
                    {
                      name: "耳朵大小",
                      code: "001-002-012-001-001",
                      setting_mode: 0,
                      cmd_code: "CMD01083",
                      range: {
                        left_value: "-1",
                        right_value: "1",
                        inclusive_left_range: "1",
                        inclusive_right_range: "1",
                        scale: 8
                      }
                    }
                  ]
                }
              ]
            },
            {
              name: "鼻子",
              code: "001-002-013",
              detail: [
                {
                  name: "鼻翼",
                  code: "001-002-013-004",
                  detail: [
                    {
                      name: "宽度",
                      code: "001-002-013-004-003",
                      setting_mode: 0,
                      cmd_code: "CMD01105",
                      range: {
                        left_value: "-1",
                        right_value: "1",
                        inclusive_left_range: "1",
                        inclusive_right_range: "1",
                        scale: 8
                      }
                    }
                  ]
                }
              ]
            },
            {
              name: "嘴巴",
              code: "001-002-014",
              detail: [
                {
                  name: "整体",
                  code: "001-002-014-001",
                  detail: [
                    {
                      name: "嘴巴大小",
                      code: "001-002-014-001-001",
                      setting_mode: 0,
                      cmd_code: "CMD01106",
                      range: {
                        left_value: "-1",
                        right_value: "1",
                        inclusive_left_range: "1",
                        inclusive_right_range: "1",
                        scale: 8
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "静态表情",
      code: "010",
      detail: [
        {
          name: "快乐的",
          code: "010-001",
          setting_mode: 0,
          cmd_code: "CMD10001",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        },
        {
          name: "悲哀的",
          code: "010-002",
          setting_mode: 0,
          cmd_code: "CMD10002",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        },
        {
          name: "发怒的",
          code: "010-003",
          setting_mode: 0,
          cmd_code: "CMD10003",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        },
        {
          name: "笑",
          code: "010-004",
          setting_mode: 0,
          cmd_code: "CMD10004",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        },
        {
          name: "好奇的",
          code: "010-005",
          setting_mode: 0,
          cmd_code: "CMD10005",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        },
        {
          name: "害怕的",
          code: "010-006",
          setting_mode: 0,
          cmd_code: "CMD10006",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        },
        {
          name: "困惑的",
          code: "010-007",
          setting_mode: 0,
          cmd_code: "CMD10007",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        },
        {
          name: "固执的",
          code: "010-008",
          setting_mode: 0,
          cmd_code: "CMD10008",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        },
        {
          name: "无聊的",
          code: "010-009",
          setting_mode: 0,
          cmd_code: "CMD10009",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        },
        {
          name: "自信的",
          code: "010-010",
          setting_mode: 0,
          cmd_code: "CMD10010",
          range: {
            left_value: "0",
            right_value: "1",
            inclusive_left_range: "1",
            inclusive_right_range: "1",
            scale: 8
          }
        }
      ]
    }
  ]
}

  返回参数说明              
body_parts	Array	身体部位

body_parts下字段说明
name	string	身体部位说明
positon	Array	身体部位具体位置

body_parts.positon下字段说明
name	string	身体部位说明
detail	Array	身体部位具体详情位置
view_category	string	展示类型 tab(tab区分)，tiled （上下平铺），

body_parts.positon.detail下字段说明
Name	String	名称
detail	array	详情
detail.setting_mode	int	设置方式 0-区间设置 1-下拉框
detail.cmd_code	String	指令编号
detail.range.left_value  	String	左区间值，如： -1 setting_mode为0 时使用 以指令文档为准
detail.range.right_value  	String	右间值，如： 1 setting_mode为0 时使用 以指令文档为准
detail.range.inclusive_left_range  	String	是否包含左区间值，如： 1.包含，0.不包含 setting_mode为0 时使用 以指令文档为准
detail.range.inclusive_right_range  	String	是否包含右区间值，如： 1.包含，0.不含包 setting_mode为0 时使用 以指令文档为准
detail.select	array	下拉选项 setting_mode为1 时使用
detail.select.option		选项值（具体待定）
*/
export type TBodyPartPositionDetailInfo = {
  name: string // 高度
  setting_mode: 0 | 1
  code: string
  cmd_code: string
  range: {
    left_value: string
    right_value: string
    inclusive_left_range: string
    inclusive_right_range: string
    scale: bumber
  }
}
export type TBodyPartPositionDetail = {
  name: string // 整体
  code: string
  detail: TBodyPartPositionDetailInfo[]
}
export type TBodyPartPosition = {
  name: string // 头型
  code: string
  detail: TBodyPartPositionDetail[]
}
export type TBodyPart = {
  name: string // 捏脸
  code: string
  detail: TBodyPartPosition[]
}

export type TEditHumanConfigResParams = {
  body_parts: TBodyPart[]
}

// export type TEditHumanConfigResParams = {
//   body_parts: TBodyPartPosition[]
// }

/**编辑数字人配置 ^^^^^ */

export type TSelectedHumanModelInfo = {
  humanName: string
  humanId: string
  humanNo: string
  humanCatg?: EModelCatg
  gender?: EGender
}

export type TSelectedPresetInfo = {
  id: string
  name: string
  cmdCode: string
}

export type TPresetListInfo = {
  id: string
  previewUrl: string
  name: string
  cmdCode: string
}

export type TOperateResult = {
  humanNo: string
  taskId: string
  result: boolean
  msg?: string
}

export type TEditItem = {
  taskId: string
  commandId: string
  result?: boolean
  msg?: string
}

export type TMicroAdjustItem = TEditItem & { commandValue: number }

export type TWholeEditRecord = {
  [EBodyParts.Header]?: {
    presets?: TEditItem[] // 头部的每个部位都会有预设效果， 暂时UE端不支持
    presetsTaskIds?: string[]
    microAdjust?: TMicroAdjustItem[]
    microAdjustTaskIds?: string[]
  }
  staticEmotion?: TEditItem
  staticEmotionTaskId?: string
  dynamicEmotion?: TEditItem
  dynamicEmotionTaskId?: string
  action?: TEditItem
  actionTaskId?: string
}

export type TEditRecords = {
  [x: string]: TWholeEditRecord
}

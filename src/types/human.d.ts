export enum EGender {
  Male = 0,
  Female
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
export type TPlateFormHumanResParams = {
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
  rows: TPlateFormHumanResParams[]
}

// category 0-静态 1-动态
export type TEmotionCatg = {
  category: 0 | 1
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
}

export type TActionParams = {
  actionId: string
  previewUrl: string
  name: string
}

/**编辑数字人配置 */
/*
  "body_parts":[
    {
        "name":"头型",
        "code":"001",
        "position":[
            {
                "name":"整体",
                "code":"001-001",
                "detail":[
                    {
                        "name":"",
                        "code":"001-001-001",
                        "detail":[
                            {
                                "name":"扁头",
                                "setting_mode":0,
                                "code":"001-001-001-001",
                                "range":{
                                    "value":[-1,1],
                                    "scale":8
                                }
                            },
                            {
                                "name":"高度",
                                "setting_mode":0,
                                "code":"001-001-001-002",
                                "range":{
                                    "value":[-1,1],
                                    "scale":8
                                }
                            },
                            {
                                "name":"宽度",
                                "code":"001-001-001-003",
                                "setting_mode":0,
                                "range":{
                                    "value":[-1,1],
                                    "scale":8
                                }
                            }
                        ]
                    }
                ]
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
detail.range.value	Array	区间值，如： [-1,1] setting_mode为0 时使用 以指令文档为准
detail.range.scale	int	小数位最大支持位数 setting_mode为0 时使用
detail.select	array	下拉选项 setting_mode为1 时使用
detail.select.option		选项值（具体待定）
*/
export type TBodyPartPositionDetailInfo = {
  name: string
  setting_mode: 0 | 1
  code: string
  range: {
    value: [number, number]
    scale: number
  }
}
export type TBodyPartPositionDetail = {
  name: string
  code: string
  detail: TBodyPartPositionDetailInfo[]
}
export type TBodyPartPosition = {
  name: string
  code: string
  detail: TBodyPartPositionDetail[]
}
export type TBodyPart = {
  name: string
  code: string
  position: TBodyPartPosition[]
}

export type TEditHumanConfigResParams = {
  body_parts: TBodyPart[]
}

import { EModelCatg, EEmotionCatg } from "@/types/human.d"
import { t } from "../locale"
// 项目各种常量
// 手机号 只校验第一位是否为1开头  其余只要是数字即可
export const MOBILE_REG = /^1\d{10}$/
export const MOBILE_INPUT_REG = /^1\d{0,10}$/
export const INT_NUMBER_INPUT_REG = /^\d+$/
// 截取开头的数字
export const START_NUMBER_REG = /^(\d+)?/
export const MSG_CODE_REG = /^\d{4}$/
/**
 *  8-32字符 至少1数字字符 至少1小写字母 可以包含特殊字符
 * ^(?=.*[A-Za-z])(?=.*\\d)[\\w~!@#$%^&*_\\-?\\(\\)_\\+=\\{\\}\\|\\[\\]:\";'<>,./]{8,32}
 *
 */
export const PASSWORD_REG = /^(?=.*[A-Za-z])(?=.*\d)[\w~!@#$%^&*_\-?()_+={}|[\]:";'<>,./`]{8,32}$/
// 输入密码时的检查规则
export const PASSWORD_INPUT_REG = /^[a-zA-Z0-9\w~!@#$%^&*_\-?()_+={}|[\]:";'<>,./`]+$/
// 输入密码时去掉不符规则的字符
export const PASSWORD_INPUT_CORRECT_REG = /^([a-zA-Z0-9\w~!@#$%^&*_\-?()_+={}|[\]:";'<>,./`]+)/
// 检测密码是否包含非规定的字符
export const PASSWORD_INPUT_ILLIGAL_REG = /[^a-zA-Z0-9\w~!@#$%^&*_\-?()_+={}|[\]:";'<>,./`]/

// 密码包含数字
export const CONTAIN_NUMBER = /[0-9]/
// 包含字母
export const CONTAIN_LETTER = /[a-z]/i
// 包含数字和字母
export const CONTAIN_NUMBER_LETTER = /(?=.*?[a-zA-Z])(?=.*?[0-9])/

export const CAPTCHA_ID = "647f5ed2ed8acb4be36784e01556bb71"

export const NUM_LETTERS_COLLECTS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

export const NUMBER_LETTER_ONLY = /^[0-9a-zA-Z]{1,4}$/

// 口令正则
export const PASSCODE_REG = /^[0-9a-zA-Z]{4}$/
// 截取开头的字符
export const START_NUMBER_OR_LETTER_REG = /^([0-9a-zA-Z]+)/

// 金额实时校验
export const AMOUNT_INPUT_REG = /^(\d+(\.(\d{0,2})?)?)/
// 金额失焦时校验
export const AMOUNT_REG = /^\d+(\.(\d{0,2})?)?$/

export const PLAYER_TYPE = "5"

export const HumanModelCatgs = [
  {
    value: EModelCatg.Buildin,
    label: t("edit.t1")
  },
  {
    value: EModelCatg.User,
    label: t("edit.t2")
  }
]

export const HumanEmotionCatgs = [
  {
    value: EEmotionCatg.Static,
    label: t("edit.t7")
  },
  {
    value: EEmotionCatg.Dynamic,
    label: t("edit.t8")
  }
]

export const HumanActionCatgs = [
  {
    value: 0,
    label: t("edit.t9")
  }
]

export const OPERATE_CMD_CODES = {
  Show: "CMD00001", // 显示数字人模型，切换数字人
  Copy: "CMD00002", // 复制数字人
  Delete: "CMD00003", // 删除数字人
  Save: "CMD00004", // 保存数字人
  Reset: "CMD00005", // 恢复数字人, 数字人编辑后不保存  回退后需要恢复
  RemoveEmotionAction: "CMD00006" // 移除表情和动作
}

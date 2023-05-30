import type { OmitAndOptional2Required } from "./index"

export interface IValidateResult {
  error?: string
  ok?: boolean
  clear?: boolean
  reviseValue?: string
}

export interface IValidateSetPWDResult extends Omit<IValidateResult, "error"> {
  letterOk?: boolean
  numberOk?: boolean
  numberLetterOk?: boolean
  lengthOk?: boolean
  illigal?: boolean
}

export type TBreadcrumbMenu = {
  id?: string
  value: number | string
  label: string
  path?: string
  // parent?: string
  canJump?: boolean
}

export enum EEditCompName {
  EditEmpty = "EditEmpty",
  EditHeaderPart = "EditHeaderPart",
  EditEmotions = "EditEmotions",
  EditActions = "EditActions"
}

export type TEditHumanMenu = {
  id?: string
  value: EEditCompName
  label?: string
  path?: string
  icon?: string
  iconType?: "svg" | "image"
  defaultSelected?: boolean
}

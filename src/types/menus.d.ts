export type TBreadcrumbMenu = {
  id?: string
  value: string
  label: string
  path?: string
  // parent?: string
  canJump?: boolean
}

export enum EEditCompName {
  EditHeaderPart,
  EditEmotions,
  EditActions
}

export type TEditHumanMenu = {
  id?: string
  value: EEditCompName
  label?: string
  path?: string
  icon?: string
  iconType?: "svg" | "image"
  selected?: boolean
}

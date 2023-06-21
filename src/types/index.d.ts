// 可选变必选
export type Optional2Required<T, K extends keyof T> = {
  [P in K]-?: T[P]
} & Omit<T, K>

// 必选变可选
export type Required2Optional<T, K extends keyof T> = {
  [P in K]?: T[P]
} & Omit<T, K>

// 过滤掉一些属性，同时制定一些属性可选变必选
export type OmitAndOptional2Required<T, K extends keyof T, N extends keyof T> = {
  [P in N]-?: T[P]
} & Omit<T, K | N>

export type TVoidFunction = <T>(arg: T) => {}

export interface IVoidFunction {
  <T>(arg: T): void
}

export type TObj = {
  [x: string]: any
}

export type TObjGeneric<T> = {
  [x: string]: T
}

export type TTimeout = ReturnType<typeof setTimeout>

export type TInterval = ReturnType<typeof setInterval>

export type TModal = {
  title: string
  content: string
  // 0-提示文本 不带图标
  // 1-提示文本 带警告图标
  // 可扩展
  type: 0 | 1
  show?: boolean
}

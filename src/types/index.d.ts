// 可选变必选
export type Optional2Required<T, K extends keyof T> = {
  [P in K]-?: T[P]
} & Omit<T, K>

// 过滤掉一些属性，同时制定一些属性可选变必选
export type OmitAndOptional2Required<T, K extends keyof T, N extends keyof T> = {
  [P in N]-?: T[P]
} & Omit<T, K | N>

export type TVoidFunction = <T>(arg: T) => {}

export interface IVoidFunction {
  <T>(arg: T): void
}

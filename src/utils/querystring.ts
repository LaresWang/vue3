import type { TObjGeneric } from "@/types"

export const qs2Obj = (url?: string): TObjGeneric<string> => {
  const res: TObjGeneric<string> = {}
  const urlObj = new URL(url || location.href)
  const params = new URLSearchParams(urlObj.search)
  for (const [key, value] of params) {
    res[key] = value
  }

  return res
}

export const obj2qs = (params: TObjGeneric<string>): string => {
  return new URLSearchParams(params).toString()
}

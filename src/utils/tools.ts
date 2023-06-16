import crypto from "crypto-js"
import { NUM_LETTERS_COLLECTS } from "./const"

// 生成uuid
export const genUUID = function (len?: number, radix?: number, suffix?: string): string {
  const chars = NUM_LETTERS_COLLECTS.split("")
  const uuid = []
  let i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-"
    uuid[14] = "4"

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  suffix && uuid.push(suffix)

  return uuid.join("")
}

export const getBrowserUUID = (): string => {
  const suffix = crypto.MD5(location.href).toString()
  console.log(suffix)
  let uuid = sessionStorage.getItem("uid")
  if (!uuid || !uuid.endsWith(suffix)) {
    console.log(uuid)
    uuid = genUUID(undefined, undefined, suffix)
    sessionStorage.setItem("uid", uuid)
  }

  return uuid
}

export const getCiphertext = (text: string, salt: string): string => {
  return crypto.AES.encrypt(text, salt).toString()
}

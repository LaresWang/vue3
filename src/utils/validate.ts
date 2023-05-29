import { t } from "../locale";
import {
  MOBILE_REG,
  MOBILE_INPUT_REG,
  PASSWORD_REG,
  INT_NUMBER_INPUT_REG,
  START_NUMBER_REG,
  MSG_CODE_REG,
  CONTAIN_LETTER,
  CONTAIN_NUMBER,
  CONTAIN_NUMBER_LETTER,
  PASSWORD_INPUT_REG,
  PASSWORD_INPUT_CORRECT_REG,
  PASSWORD_INPUT_ILLIGAL_REG,
  AMOUNT_REG,
  AMOUNT_INPUT_REG,
} from "./const";

import type { IValidateResult, IValidateSetPWDResult } from "../types/login"

// 手机号输入框失焦时校验
export const validateMobileBlur = function (value: string): IValidateResult {
  if (!value || !value.trim()) {
    // 请输入手机号
    return {
      error: t("user.t1"),
    };
  }
  if (!MOBILE_REG.test(value.trim())) {
    // 手机号格式不正确
    return {
      error: t("user.t3"),
    };
  }

  return {
    ok: true,
  };
};

// 输入手机号时实时校验 边输入边校验
export const validateMobileChange = function (value: string): IValidateResult {
  if (!value) {
    return {};
  }
  if (!INT_NUMBER_INPUT_REG.test(value)) {
    const temp = value.match(START_NUMBER_REG);
    if (temp && temp[1]) {
      return {
        reviseValue: temp[1],
        ok: MOBILE_REG.test(temp[1]),
      };
    }
    return {
      clear: true,
    };
  }
  // 手机号最长11位
  if (value.length > 11) {
    const keeped = value.slice(0, 11);
    return {
      reviseValue: keeped,
      ok: MOBILE_REG.test(keeped),
    };
  }

  if (!MOBILE_INPUT_REG.test(value)) {
    return {
      error: t("user.t3"),
    };
  }

  if (MOBILE_REG.test(value)) {
    return {
      ok: true,
    };
  }
  return {};
};
// 登录时密码只校验非空就行
// export const validateEmptyForPasswordBlur = function (value) {
//   if (!value || !value.trim()) {
//     return {
//       error: t("t5"),
//     };
//   }
//   return {
//     ok: true,
//   };
// };

// 登录时密码校验
export const validatePasswordBlur = function (value:string): IValidateResult {
  if (!value || !value.trim()) {
    return {
      error: t("user.t5"),
    };
  }
  if (PASSWORD_REG.test(value)) {
    return {
      ok: true,
    };
  }
  return {
    error: t("user.t6"),
  };
};
// 登录时密码校验
// a)	限制输入除数字、字母和定义的符号（反斜杠与空格也不允许输入）的字符。
// 除密码规则内的字符外不允许输入
export const validatePasswordChange = function (value: string, isPasted=false): IValidateResult {
  if (!value || !value.trim()) {
    return {
      clear: true,
    };
  }
  if (PASSWORD_INPUT_REG.test(value)) {
    return {
      ok: PASSWORD_REG.test(value),
    };
  }
  if (isPasted) {
    return {};
  }
  const ret = value.match(PASSWORD_INPUT_CORRECT_REG);
  if (ret && ret[1]) {
    return {
      reviseValue: ret[1],
      ok: PASSWORD_REG.test(ret[1]),
    };
  } else {
    return {
      clear: true,
    };
  }
};

// 登录时密码只校验非空就行
// export const validateEmptyForPasswordChange = function (value) {
//   if (!value || !value.trim()) {
//     return {};
//   }
//   return {
//     ok: true,
//   };
// };

// 登录时短信验证码只校验非空就行
export const validateEmptyForMsgCodeBlur = function (value:string): IValidateResult {
  if (!value || !value.trim()) {
    return {
      error: t("user.t2"),
    };
  }
  // 短信验证码4位数字
  if (!MSG_CODE_REG.test(value)) {
    return {
      error: t("user.t4"),
    };
  }
  return {
    ok: true,
  };
};
// 登录时短信验证码只校验正整数 最多四位
export const validateEmptyForMsgCodeChange = function (value:string): IValidateResult {
  if (!value || !value.trim()) {
    return {
      clear: true,
    };
  }
  if (!INT_NUMBER_INPUT_REG.test(value)) {
    const temp = value.match(START_NUMBER_REG);
    if (temp && temp[1]) {
      return {
        reviseValue: temp[1],
        ok: MSG_CODE_REG.test(temp[1]),
      };
    }
    return {
      clear: true,
    };
  }
  // 最长4位
  if (value.length > 4) {
    const keeped = value.slice(0, 4);
    return {
      reviseValue: keeped,
      ok: MSG_CODE_REG.test(keeped),
    };
  }

  if (MSG_CODE_REG.test(value)) {
    return {
      ok: true,
    };
  }
  return {};
};

// 设置密码时的校验 校验密码
export const validateSetPassword = function (value:string, isPasted=false): IValidateSetPWDResult {
  if (!value || !value.trim()) {
    return {
      clear: true,
    };
  }
  // value = value.trim();
  let reviseValue = "";
  let clear = false;
  if (!isPasted && !PASSWORD_INPUT_REG.test(value)) {
    const ret = value.match(PASSWORD_INPUT_CORRECT_REG);
    if (ret && ret[1]) {
      reviseValue = ret[1];
    } else {
      clear = true;
    }
  }
  reviseValue && (value = reviseValue);
  clear && (value = "");
  return {
    // haveValue: !clear,
    letterOk: CONTAIN_LETTER.test(value),
    numberOk: CONTAIN_NUMBER.test(value),
    numberLetterOk: CONTAIN_NUMBER_LETTER.test(value),
    lengthOk: value.length > 7 && value.length < 33,
    ok: PASSWORD_REG.test(value),
    illigal: PASSWORD_INPUT_ILLIGAL_REG.test(value),
    reviseValue,
    clear,
  };
};

export const validateSetConfirmPassword = function (value:string, pwd: string): IValidateResult {
  if (!value || !pwd) {
    return {
      clear: true,
    };
  }
  if (pwd !== value) {
    return {
      // haveValue: true,
      error: t("user.t13"),
    };
  } else {
    return {
      // haveValue: true,
      ok: true,
    };
  }
};

// 输入充值金额时校验
export const validateRechargeInput = function (value:string): IValidateResult {
  if (!value) {
    return {};
  }
  if (!AMOUNT_REG.test(value)) {
    const temp = value.match(AMOUNT_INPUT_REG);
    if (temp && temp[1]) {
      let val = "";
      if (temp[1].includes(".")) {
        const arr = temp[1].split(".");
        val = `${+arr[0]}.${arr[1]}`;
      } else {
        val = +value+"";
      }
      return {
        reviseValue: val,
        ok: AMOUNT_REG.test(temp[1]),
      };
    }
    return {
      clear: true,
    };
  }
  console.log(1111);
  if (AMOUNT_REG.test(value)) {
    let val = "";
    if (value.includes(".")) {
      const arr = value.split(".");
      val = `${+arr[0]}.${arr[1]}`;
    } else {
      val = +value+"";
    }
    return {
      reviseValue: val,
      ok: true,
    };
  }
  return {};
};

// 输入金额失焦时校验
// export const validateRechargeBlur = function (value:string): IValidateResult {
//   if (!value || !value.trim()) {
//     // 请输入金额
//     return {
//       error: t("t199"),
//     };
//   }
//   if (!AMOUNT_REG.test(value.trim())) {
//     // 金额格式不正确
//     return {
//       error: t("t200"),
//     };
//   }

//   return {
//     ok: true,
//   };
// };

// 非空校验
export const validateNoEmpty = function (value:string): IValidateResult {
  if (!value || !value.trim()) {
    return {};
  }
  return {
    ok: true,
  };
};

// 用户名校验 现在只限制20个长度
export const validateUserName = function (value:string): IValidateResult {
  if (!value || !value.trim()) {
    return {};
  }
  const name = value.trim();
  return {
    ok: true,
    reviseValue: name.slice(0, 20),
  };
};


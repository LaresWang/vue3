<template>
  <div class="pwd-input">
    <div
      class="pwd-input-inner flex-center"
      :class="data.errTipContent ? 'is-error' : ''"
    >
      <div class="icon-wrapper flex-center">
        <img
          src="@/assets/imgs/icon_lock.svg"
          alt=""
        />
      </div>
      <input
        ref="pwdInput"
        v-model="data.value"
        class="input-ele"
        :type="data.inputType"
        :placeholder="placeholder || $t('user.t5')"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
        @keyup.enter="pressEnterKey"
        @paste="onPaste"
      />
      <!-- <input
        class="input-ele"
        :type="inputType"
        v-bind="$attrs"
        :value="value"
        v-on="inputListeners"
      /> -->
      <div class="icon-wrapper flex-center">
        <div
          class="pointer"
          @click="toggleShowType"
        >
          <img
            v-if="data.showOriginText"
            src="@/assets/imgs/icon_see.svg"
            alt=""
          />
          <img
            v-else
            src="@/assets/imgs/icon_see_no.svg"
            alt=""
          />
        </div>
      </div>
      <span
        v-if="data.errTipContent"
        class="err-msg"
      >
        {{ data.errTipContent }}
      </span>
      <div
        v-if="data.showPwdTipPanel"
        class="pwd-tip-panel"
      >
        <div
          v-if="!data.showPasteTip"
          class="tip-panel-inner"
        >
          <div class="flex-start">
            <span
              v-show="!pwdInfos.value.lengthOk"
              class="icon-error"
            ></span>
            <span
              v-show="pwdInfos.value.lengthOk"
              class="icon-success"
            ></span>
            <!-- 密码长度8到32位 -->
            <span :class="{ active: pwdInfos.value.lengthOk }"> {{ $t("user.t17") }} </span>
          </div>
          <div class="flex-start">
            <span
              v-show="!pwdInfos.value.numberLetterOk"
              class="icon-error"
            ></span>
            <span
              v-show="pwdInfos.value.numberLetterOk"
              class="icon-success"
            ></span>
            <!-- 必须包含数字字母 -->
            <span :class="{ active: pwdInfos.value.numberLetterOk }"> {{ $t("user.t16") }} </span>
          </div>
        </div>
        <div
          v-else
          class="tip-panel-inner"
        >
          <div class="flex-start">
            <span class="icon-error"></span>
            <span> {{ $t("user.t27") }} </span>
          </div>
        </div>
      </div>

      <div
        v-if="['2', '3'].includes(props.from)"
        class="icons-group flex-center"
      >
        <span
          v-show="data.errTipContent"
          class="icon-error"
        ></span>
        <span
          v-show="data.iconOk"
          class="icon-success"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, nextTick } from "vue"
  import { validatePasswordChange, validatePasswordBlur, validateSetPassword, validateSetConfirmPassword } from "@/utils/validate"

  import type { IValidateResult, IValidateSetPWDResult } from "@/types/login"
  import type { TTimeout } from "@/types"

  const props = withDefaults(
    defineProps<{
      placeholder?: string // 定义组建接收绑定的传参
      comparedValue?: string
      from?: string
      // @from
      // 1-实时校验，不符合密码规则的不让输入 登录场景
      // 2-实时校验规则，给出浮层提示 设置密码 填写密码场景
      // 3-不校验规则，确认密码
      // 2, 3 都需要勾号叉号显示
    }>(),
    {
      comparedValue: "",
      from: "1"
    }
  )

  const emits = defineEmits(["validate", "enterPress"])

  const data = reactive({
    errText: "",
    errTipContent: "",
    inputType: "password",
    showOriginText: false,
    value: "",
    isOk: false,
    iconOk: false,
    showPwdTipPanel: false,
    showPasteTip: false
  })
  const pwdInfos = reactive<{ value: IValidateSetPWDResult }>({ value: {} })
  const pwdInput = ref()

  let errTimmer: TTimeout = 0
  let okTimmer: TTimeout = 0

  let isSwitchInputType = false
  let isFromPaste = false

  watch(
    () => props.comparedValue,
    (val) => {
      if (props.from === "3") {
        if (val) {
          startCompare()
        } else {
          data.iconOk = false
          data.errText = ""
        }
      }
    }
  )

  watch(
    () => data.errText,
    (val) => {
      if (errTimmer) {
        clearTimeout(errTimmer)
      }
      errTimmer = setTimeout(() => {
        data.errTipContent = val
      }, 300)
    }
  )

  watch(
    () => pwdInfos.value,
    (val) => {
      if (okTimmer) {
        clearTimeout(okTimmer)
      }
      okTimmer = setTimeout(() => {
        data.iconOk = val.ok || false
      }, 300)
    }
  )

  const toggleShowType = () => {
    data.showOriginText = !data.showOriginText
    isSwitchInputType = true
    if (data.showOriginText) {
      data.inputType = "text"
    } else {
      data.inputType = "password"
    }
    nextTick(() => {
      pwdInput.value.focus()
    })
  }

  const onFocus = () => {
    data.errText = ""
    if (props.from === "2") {
      data.showPwdTipPanel = true
    }
    isSwitchInputType = false
  }

  const onInput = () => {
    let ret: IValidateResult | IValidateSetPWDResult = {}

    if (props.from === "1") {
      console.log("input", data.value)
      ret = validatePasswordChange(data.value, isFromPaste)
    } else if (props.from === "2" || props.from === "3") {
      const ret1 = validateSetPassword(data.value, isFromPaste)
      ret = ret1
      if (props.from === "2") {
        pwdInfos.value = ret1
        // 如果粘贴了包含非规定的字符，浮窗“密码只能包含字母、数字、符号”的提示，显示错误。光标从输入框中移除，提示“密码不符合设置规则”
        if (isFromPaste && ret1.illigal) {
          data.showPasteTip = true
        } else {
          data.showPasteTip = false
        }
      } else {
        data.errText = ""
        // 再次输入密码的密码框勾号图标及时显示
        if (props.from === "3" && props.comparedValue) {
          startCompare("input")
        }
      }
    }

    isFromPaste = false
    if (ret.reviseValue) {
      data.value = ret.reviseValue
    }
    if (ret.clear) {
      data.iconOk = false
      data.value = ""
    }
    if (props.from === "1") {
      // 登录时密码输入框只要有值就可点击登录
      if (data.value) {
        emits("validate", true, data.value)
      } else {
        emits("validate", false)
      }
    } else if (props.from !== "3" || !props.comparedValue) {
      if (ret.ok) {
        emits("validate", true, data.value)
      } else {
        emits("validate", false)
      }
    } else {
      emits("validate", data.value === props.comparedValue, data.value)
    }
  }

  const onBlur = () => {
    if (isSwitchInputType) {
      // 在切换明文密文时不校验规则
      isSwitchInputType = false
      return
    }
    data.showPwdTipPanel = false

    let ret = null

    ret = validatePasswordBlur(data.value)

    if (props.from === "1") {
      // 登录时密码输入框只要有值就可点击登录
      if (data.value) {
        emits("validate", true, data.value)
      } else {
        data.errText = ret.error || ""
        emits("validate", false)
      }
      return
    }
    if (props.from === "3" && data.value && props.comparedValue) {
      startCompare()
      return
    }

    if (ret.ok) {
      data.isOk = true
      emits("validate", true, data.value)
    } else if (ret.error) {
      emits("validate", false)
      if (props.from === "3" && data.value && !props.comparedValue) {
        return
      }
      data.errText = ret.error
    }
  }

  const onPaste = () => {
    // 内容粘贴过来的也会触发input事件
    isFromPaste = true
  }

  const pressEnterKey = () => {
    emits("enterPress")
  }

  const startCompare = (type?: string) => {
    const ret = validateSetConfirmPassword(data.value, props.comparedValue)
    if (ret.ok) {
      data.errText = ""
      pwdInfos.value = {
        ok: true
      }
      emits("validate", true, data.value)
    } else if (ret.error) {
      data.iconOk = false
      type !== "input" && (data.errText = ret.error)
      pwdInfos.value = {
        ok: false
      }
      emits("validate", false)
    }
  }
</script>

<style lang="less">
  .pwd-input {
    width: 100%;
    padding-bottom: 20px;
    .pwd-input-inner {
      position: relative;
      width: 100%;
      height: 40px;
      padding: 0;
      background: var(--c-white-1);
      border: 1px solid var(--c-gray-2);
      border-radius: 4px;
      .input-ele {
        flex: 1;
        height: 32px;
        border: none;
        outline: none;
        font-size: 14px;
        color: var(--c-black-2);
      }
      .icon-wrapper {
        width: 28px;
        height: 100%;
        img {
          width: 12px;
        }
      }
      &.is-error {
        border-color: var(--c-red-1);
        &:hover {
          border-color: var(--c-red-1);
        }
      }
      .err-msg {
        position: absolute;
        left: 0;
        top: calc(100% + 4px);
        line-height: 1;
        font-size: 12px;
        color: var(--c-red-2);
        letter-spacing: 0;
      }
      .pwd-tip-panel {
        position: absolute;
        width: 100%;
        top: calc(100% + 4px);
        // padding-right: 20px;
        z-index: 10;
        .tip-panel-inner {
          padding: 4px 13px;
          border-radius: 5px;
          background: var(--c-white-1);
          box-shadow: 0 0 10px 0 rgba(155, 174, 201, 0.4);
          border-radius: 6px 0 0 0 6px 6px 6px;
          border-radius: 6px 0 0 0 6px 6px 6px;
          font-size: 12px;
          color: var(--c-gray-1);
          > div {
            padding: 4px 0;
          }
          .active {
            color: var(--c-black-2);
          }
        }
      }
      .icons-group {
        width: 25px;
        height: 40px;
        position: absolute;
        right: -25px;
        top: 0;
      }
      &:hover {
        border-color: #adb1d4;
      }
      &:focus-within {
        border: 1px solid var(--c-blue-1);
      }
    }
  }
</style>

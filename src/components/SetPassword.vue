<template>
  <el-dialog
    v-model="rdata.showDialog"
    width="334px"
    :show-close="false"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="nt-set-password"
    top="50vh"
  >
    <div class="set-password-inner">
      <div class="set-header">
        <div class="header-title">
          {{ $t("user.t10") }}
        </div>
        <div class="header-detail">
          {{ $t("user.t21") }}
        </div>
      </div>
      <div class="set-pwd-inputs">
        <div class="nt-input-item">
          <!-- 密码 -->
          <div class="label">{{ $t("user.t11") }}</div>
          <div class="input-wrapper">
            <PasswordInput
              from="2"
              @validate="validatePwd"
            />
          </div>
        </div>
        <div class="nt-input-item">
          <!-- 确认密码 -->
          <div class="label">{{ $t("user.t12") }}</div>
          <div class="input-wrapper">
            <PasswordInput
              from="3"
              :compared-value="rdata.pwd"
              @validate="validateRepwd"
            />
          </div>
        </div>
      </div>
      <div class="flex-v set-btns">
        <!-- 提交 -->
        <el-button
          type="primary"
          :disabled="rdata.disabled"
          @click="setPassword"
        >
          {{ $t("user.t14") }}
        </el-button>
        <span></span>
        <!-- 稍后设置 -->
        <div
          class="mt15 pointer later-set"
          @click="setLater"
        >
          {{ $t("user.t15") }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
  import { reactive, watchEffect } from "vue"
  import { debounce } from "lodash"
  import { modifyPassword, setPasswordLater } from "@/api/user"
  import message from "@/utils/message"
  import { t } from "@/locale"

  import PasswordInput from "./PasswordInput.vue"

  type TRdata = {
    showDialog: boolean
    pwd: string
    repwd: string
    pwdInfos: {
      ok?: boolean
    }
    repwdInfos: {
      ok?: boolean
    }
    disabled: boolean
    showPwdTipPanel: boolean
    showRepwdTip: boolean
  }
  const rdata = reactive<TRdata>({
    showDialog: false,
    pwd: "",
    repwd: "",
    pwdInfos: {},
    repwdInfos: {},
    disabled: true,
    showPwdTipPanel: false,
    showRepwdTip: false
  })

  const props = withDefaults(
    defineProps<{
      show: boolean
    }>(),
    {
      show: false
    }
  )

  watchEffect(() => {
    rdata.showDialog = props.show
  })

  const setPassword = debounce(function () {
    console.log(rdata.pwd)
    if (!rdata.pwdInfos.ok) {
      // 高亮密码输入框

      return
    }
    if (!rdata.repwdInfos.ok) {
      // 高亮确认密码输入框

      return
    }

    if (rdata.pwdInfos.ok && rdata.repwdInfos.ok) {
      modifyPassword({
        password: rdata.pwd,
        confirmPassword: rdata.repwd
      })
        .then(() => {
          message(t("user.t26"))
          rdata.showDialog = false
        })
        .catch((e) => {
          console.log(e)
          if (e.code === "20001") {
            rdata.showDialog = false
          }
        })
    }
  }, 300)

  const setLater = debounce(function () {
    setPasswordLater().then(() => {
      rdata.showDialog = false
    })
  }, 300)

  const updateConfirmBtnStatus = () => {
    if (rdata.pwdInfos.ok && rdata.repwdInfos.ok) {
      rdata.disabled = false
    } else {
      rdata.disabled = true
    }
  }

  const validatePwd = (valid: boolean, value: string) => {
    if (valid) {
      rdata.pwd = value
      rdata.pwdInfos.ok = true
    } else {
      rdata.pwd = ""
      rdata.pwdInfos.ok = false
    }
    updateConfirmBtnStatus()
  }

  const validateRepwd = (valid: boolean, value: string) => {
    if (valid) {
      rdata.repwd = value
      rdata.repwdInfos.ok = true
    } else {
      rdata.repwd = ""
      rdata.repwdInfos.ok = false
    }
    updateConfirmBtnStatus()
  }
</script>
<style lang="less">
  .nt-set-password {
    min-height: 390px;
    color: var(--c-black-2);
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      box-shadow: 0 0 30px 0 rgba(155, 174, 201, 0.3);
    }
    .set-password-inner {
      padding: 32px 12px 32px 20px;
      .set-header {
        text-align: center;
        font-size: 16px;
        .header-detail {
          margin-top: 8px;
          font-size: 12px;
        }
      }
      .set-pwd-inputs {
        padding-left: 12px;
        margin-top: 24px;
        .nt-input-item {
          .input-wrapper {
            padding-right: 20px;
            position: relative;
            .err-msg {
              position: absolute;
              left: 0;
              top: calc(100% + 4px);
              line-height: 1;
              color: var(--c-red-2);
              font-size: 12px;
            }
          }

          .label {
            margin-bottom: 8px;
            // width: 80px;
            // padding-right: 10px;
            // text-align: right;
          }
          // .el-input {
          //   flex: 1;
          // }
          // .icons-group {
          //   position: absolute;
          //   right: 0;
          //   top: 10px;
          // }
        }
      }
      .set-btns {
        margin-top: 24px;
        .el-button {
          height: 36px;
          width: 120px;
          padding: 0;
        }
        .later-set {
          font-size: 12px;
        }
      }
    }
  }
</style>

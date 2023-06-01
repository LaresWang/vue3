<template>
  <div class="nt-account-set">
    <div class="user-infos-down">
      <div class="upload-comp">
        <UploadCropper
          ref="uploadCropper"
          :max-height="100"
          :max-width="100"
          :limit-size="5 * 1024 * 1024"
          :accept="'.bmp, .jpg, .jpeg, .png'"
          :forbid-cropper="true"
          @startUpload="upload"
        />
      </div>

      <div class="user-infos">
        <div class="user-info-item flex-between">
          <div class="left-area flex-start">
            <div class="user-avatar">
              <Avatar :url="userInfo.userAvatar" />
            </div>

            <span class="item-label">
              {{ $t("user.t36") }}<span style="opacity: 0">{{ $t("user.t36") }}</span>
            </span>
            <span class="item-content">{{ $t("upload.t3") }}</span>
          </div>
          <div class="right-area flex-start">
            <span
              class="pointer"
              @click="invokeUpload"
            >
              {{ $t("upload.t2") }}
            </span>
          </div>
        </div>
        <div class="user-info-item flex-between">
          <div class="left-area flex-start">
            <svg-icon
              class="item-pic"
              name="icon_phone"
              alt=""
            />
            <span class="item-label">
              {{ $t("user.t37") }}
            </span>
            <span class="item-content">{{ userInfo.mobile }}</span>
          </div>
          <div class="right-area flex-start">
            <span
              class="pointer"
              @click="changeMobile"
            >
              {{ $t("user.t38") }}
            </span>
          </div>
        </div>
        <div class="user-info-item flex-between">
          <div class="left-area flex-start">
            <svg-icon
              class="item-pic"
              name="icon_user"
            />
            <span class="item-label">
              {{ $t("user.t39") }}
            </span>
            <span class="item-content">{{ userInfo.userName }}</span>
          </div>
          <div class="right-area flex-start">
            <span
              class="pointer"
              @click="modifyUserName"
            >
              {{ $t("user.t38") }}
            </span>
          </div>
        </div>
        <div class="user-info-item flex-between">
          <div class="left-area flex-start">
            <svg-icon
              class="item-pic"
              name="icon_cipher"
            />
            <span class="item-label">
              {{ $t("user.t40") }}
            </span>
            <!-- 0-未设置 1-已设置 2-稍后设置 -->
            <span class="item-content">{{ userInfo.passwordStatus === 1 ? $t("user.t41") : $t("user.t42") }}</span>
          </div>
          <div class="right-area flex-start">
            <span
              class="pointer"
              @click="setPassword"
            >
              {{ $t("user.t43") }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <el-dialog
      v-model="rdata.dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      class="account-set-modal"
      top="50vh"
    >
      <div class="account-set-modal-inner">
        <div class="modal-title flex-between">
          <span v-if="rdata.setType === 1">{{ $t("user.t44") }}</span>
          <span v-else-if="rdata.setType === 2">{{ $t("user.t45") }}</span>
          <span v-else-if="rdata.setType === 3">{{ $t("user.t46") }}</span>
          <!-- <i
            class="close-icon pointer el-icon el-icon-close"
            alt=""
            @click="closeSetModal"
          ></i> -->
          <el-icon
            class="close-icon pointer el-icon-close"
            @click="closeSetModal"
          >
            <Close />
          </el-icon>
        </div>

        <div
          v-if="rdata.setStep === 1"
          class="modal-body mt25"
        >
          <div class="modal-body-content flex-v-start">
            <div>{{ $t("user.t47", { value: userInfo.mobile }) }}</div>
            <!-- 短信验证码 -->
            <div
              class="nt-input-item with-button mt20"
              :class="rdata.prevsetInfos.error ? 'is-error' : ''"
            >
              <el-input
                v-model="rdata.prevsetInfos.value"
                :placeholder="captchaNoPwd || captchaNoMob ? $t('user.t22', { value: captchaNoPwd || captchaNoMob }) : $t('user.t2')"
                @focus="focus('prevset')"
                @input="input('prevset')"
                @blur="blur('prevset')"
              />
              <div class="msg-code-btn flex-center">
                <CountDown
                  v-if="isCountingDown"
                  @done="countDownFinished"
                />
                <el-button
                  v-else
                  @click="getSMSCode()"
                >
                  <span>{{ $t("user.t7") }}</span>
                </el-button>
              </div>
              <div class="prefix-input-icon-wrapper flex-center">
                <img src="@/assets/imgs/icon_verify.svg" />
              </div>

              <span
                v-if="rdata.prevsetInfos.error"
                class="err-msg"
              >
                {{ rdata.prevsetInfos.error }}
              </span>
            </div>
          </div>
          <div class="set-step-btn flex-end">
            <el-button
              type="primary"
              :disabled="rdata.presetBtnDisabled"
              @click="nextStep"
            >
              {{ $t("user.t29") }}
            </el-button>
          </div>
        </div>
        <!-- 第二步 -->
        <div
          v-if="rdata.setStep === 2"
          class="mt15 step-2"
        >
          <div
            v-if="rdata.setType === 1"
            class="modal-body"
          >
            <!-- 变更手机号 -->
            <div class="modal-body-content flex-v-start">
              <!-- 输入手机号 -->
              <div
                class="nt-input-item flex-start"
                :class="rdata.mobileInfos.error ? 'is-error' : ''"
              >
                <el-input
                  v-model="rdata.mobileInfos.value"
                  :placeholder="$t('user.t49')"
                  @focus="focus('mobile')"
                  @input="input('mobile')"
                  @blur="blur('mobile')"
                />
                <div class="prefix-input-icon-wrapper flex-center">
                  <img src="@/assets/imgs/icon_account_a.svg" />
                </div>
                <span
                  v-if="rdata.mobileInfos.error"
                  class="err-msg"
                >
                  {{ rdata.mobileInfos.error }}
                </span>
              </div>

              <!-- 短信验证码 -->
              <div
                class="nt-input-item with-button"
                :class="rdata.msgcodeInfos.error ? 'is-error' : ''"
              >
                <el-input
                  v-model="rdata.msgcodeInfos.value"
                  :placeholder="captchaNoMob ? $t('user.t22', { value: captchaNoMob }) : $t('user.t2')"
                  @focus="focus('msgcode')"
                  @input="input('msgcode')"
                  @blur="blur('msgcode')"
                />
                <div class="msg-code-btn flex-center">
                  <CountDown
                    v-if="isCountingDown"
                    @done="countDownFinished"
                  />
                  <el-button
                    v-else
                    :disabled="!rdata.mobileInfos.ok"
                    @click="getSMSCode(rdata.mobileInfos.value)"
                  >
                    <span>{{ $t("user.t7") }}</span>
                  </el-button>
                </div>
                <div class="prefix-input-icon-wrapper flex-center">
                  <img src="@/assets/imgs/icon_verify.svg" />
                </div>

                <span
                  v-if="rdata.msgcodeInfos.error"
                  class="err-msg"
                >
                  {{ rdata.msgcodeInfos.error }}
                </span>
              </div>
            </div>
            <div class="set-step-btn flex-end">
              <el-button
                type="primary"
                :disabled="rdata.mobileBtnDisabled"
                @click="saveNewMobile"
              >
                {{ $t("user.t14") }}
              </el-button>
            </div>
          </div>
          <div
            v-else-if="rdata.setType === 2"
            class="modal-body"
          >
            <!--
            设置用户名
            -->
            <div class="modal-body-content flex-v-start">
              <!-- 用户名 -->
              <div
                class="nt-input-item flex-start"
                :class="rdata.usernameInfos.error ? 'is-error' : ''"
              >
                <el-input
                  v-model="rdata.usernameInfos.value"
                  :placeholder="$t('user.t51')"
                  @focus="focus('username')"
                  @input="input('username')"
                  @blur="blur('username')"
                />
                <div class="prefix-input-icon-wrapper flex-center">
                  <img src="@/assets/imgs/icon_account_a.svg" />
                </div>
                <span
                  v-if="rdata.usernameInfos.error"
                  class="err-msg"
                >
                  {{ rdata.usernameInfos.error }}
                </span>
              </div>
            </div>
            <div class="set-step-btn flex-end">
              <el-button
                type="primary"
                :disabled="rdata.nameBtnDisabled"
                @click="saveUsername"
              >
                {{ $t("user.t14") }}
              </el-button>
            </div>
          </div>
          <div
            v-else-if="rdata.setType === 3"
            class="modal-body"
          >
            <!-- 设置密码 -->
            <div class="modal-body-content flex-v-start set-pwd-inputs">
              <div class="nt-input-item">
                <div class="input-wrapper">
                  <PasswordInput
                    from="2"
                    :placeholder="$t('t518')"
                    @validate="validatePwd"
                  />
                </div>
              </div>
              <div class="nt-input-item">
                <div class="input-wrapper">
                  <PasswordInput
                    from="3"
                    :placeholder="$t('user.t48')"
                    :compared-value="rdata.pwd"
                    @validate="validateRepwd"
                  />
                </div>
              </div>
            </div>
            <div class="set-step-btn flex-end">
              <el-button
                type="primary"
                :disabled="rdata.pwdBtnDisabled"
                @click="savePassword"
              >
                {{ $t("user.t14") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from "vue"
  import { Close } from "@element-plus/icons-vue"
  import type { UploadRawFile } from "element-plus"
  import message from "@/utils/message"
  import { t } from "@/locale"

  import useUserInfo from "@/stores/user"
  import { useGetUserInfo, useGetCaptchaId, useCountDownStatus } from "@/hooks/user"
  import { useCaptchaInitSet } from "@/hooks/user/set"

  import { logout, verifyLoggedSMSCode, changeUserMobile, changeUserName, changeUserPassword, uploadAvatar } from "@/api/user"
  import { goLoginPage } from "@/utils/jump"
  import {
    validateMobileChange,
    validateMobileBlur,
    validateEmptyForMsgCodeBlur,
    validateEmptyForMsgCodeChange,
    validateUserName
  } from "@/utils/validate"

  import UploadCropper from "@/components/UploadWithCropper.vue"
  import CountDown from "@/components/CountDown.vue"
  import PasswordInput from "@/components/PasswordInput.vue"
  import Avatar from "@/components/Avatar.vue"

  type TModifyTypes = "prevset" | "mobile" | "msgcode" | "username"
  type TModifyInfosTypes = "prevsetInfos" | "mobileInfos" | "msgcodeInfos" | "usernameInfos"

  type TInfos = {
    error?: string
    value?: string
    ok?: boolean
  }
  type TRdata = {
    dialogVisible: boolean
    setType: number
    prevsetInfos: TInfos
    mobileInfos: TInfos
    msgcodeInfos: TInfos
    usernameInfos: TInfos
    presetBtnDisabled: boolean
    mobileBtnDisabled: boolean
    nameBtnDisabled: boolean
    pwdBtnDisabled: boolean
    setStep: number
    pwd: string
    repwd: string
    pwdInfos: Pick<TInfos, "ok">
    repwdInfos: Pick<TInfos, "ok">
  }
  const rdata = reactive<TRdata>({
    dialogVisible: false,
    setType: 0, // 1-设置手机 2-设置用户名 3-设置密码
    prevsetInfos: {},
    mobileInfos: {},
    msgcodeInfos: {},
    usernameInfos: {},
    presetBtnDisabled: true,
    mobileBtnDisabled: true,
    nameBtnDisabled: true,
    pwdBtnDisabled: true,
    setStep: 1,
    pwd: "",
    repwd: "",
    pwdInfos: {},
    repwdInfos: {}
  })

  const uploadCropper = ref<typeof UploadCropper>()
  const { userInfo } = useUserInfo()
  const { getUser } = useGetUserInfo(true)
  const { isCountingDown, startCountDown, stopCountDown } = useCountDownStatus()
  const { captchaId: captchaIdPwd } = useGetCaptchaId(2)
  const { captchaId: captchaIdMob } = useGetCaptchaId(3)
  const { captchaNo: captchaNoPwd, getMsgCode: getMsgCodePwd, startInitGeetest: startInitGeetestPwd } = useCaptchaInitSet()
  const { captchaNo: captchaNoMob, getMsgCode: getMsgCodeMob, startInitGeetest: startInitGeetestMob } = useCaptchaInitSet()

  watch(captchaIdPwd, (val) => {
    if (val) {
      startInitGeetestPwd(val)
    }
  })

  watch(captchaIdMob, (val) => {
    if (val) {
      startInitGeetestMob(val)
    }
  })

  watch([captchaNoPwd, captchaNoMob], ([valPwd, valMob]) => {
    if (valPwd || valMob) {
      startCountDown()
    }
  })

  const invokeUpload = () => {
    console.log(11, uploadCropper.value)
    uploadCropper.value!.manualInvokeUploader()
  }

  const upload = async (params: UploadRawFile | FormData) => {
    console.log(params)
    // console.log(params.get("file"))
    try {
      await uploadAvatar({ avatarFile: params })
      console.log("上传成功")
      getUser()
    } catch (e) {
      console.log(e)
    }
  }

  const changeMobile = () => {
    // this.getCaptchaId(3)
    rdata.mobileInfos = {}
    rdata.msgcodeInfos = {}
    setDialogInfos(1)
  }

  const modifyUserName = () => {
    setDialogInfos(2)
  }

  const setPassword = () => {
    // this.getCaptchaId(2)
    setDialogInfos(3)
    // this.showPasswordComp = true;
  }

  const setDialogInfos = (val: number) => {
    stopCountDown()
    if (val === 2) {
      // 用户名设置没有第一步手机验证码
      rdata.setStep = 2
    } else {
      rdata.setStep = 1
    }
    rdata.presetBtnDisabled = true
    // this.mobileBtnDisabled = true;
    // this.nameBtnDisabled = true;
    // this.pwdBtnDisabled = true;
    rdata.prevsetInfos = {}
    rdata.setType = val
    rdata.dialogVisible = true
  }

  const getSMSCode = (mobile?: string) => {
    // 第一步时 mobile undefined
    if (rdata.setStep === 1) {
      if (rdata.setType === 1) {
        // 1-设置手机 2-设置用户名 3-设置密码
        getMsgCodeMob({
          codeType: rdata.setType
        })
      } else if (rdata.setType === 3) {
        getMsgCodePwd({
          codeType: rdata.setType
        })
      }
    } else {
      // 传mobile参数时说明时变更手机号了
      getMsgCodeMob({
        codeType: rdata.setType,
        mobile,
        sourceMobileCaptcha: rdata.prevsetInfos.value
      })
    }
  }

  const closeSetModal = () => {
    rdata.dialogVisible = false
  }

  const focus = (prop: TModifyTypes) => {
    const full = (prop + "Infos") as TModifyInfosTypes
    rdata[full].error = ""
  }
  const input = (prop: TModifyTypes) => {
    if (prop === "mobile") {
      validateAndSetInfos(validateMobileChange, prop)
    } else if (prop === "username") {
      validateAndSetInfos(validateUserName, prop)
    } else if (prop === "prevset" || prop === "msgcode") {
      validateAndSetInfos(validateEmptyForMsgCodeChange, prop)
    }
  }

  const blur = (prop: TModifyTypes) => {
    if (prop === "mobile") {
      validateAndSetInfos(validateMobileBlur, prop)
    } else if (prop === "username") {
      validateAndSetInfos(validateUserName, prop)
    } else if (prop === "prevset" || prop === "msgcode") {
      validateAndSetInfos(validateEmptyForMsgCodeBlur, prop)
    }
  }

  const validateAndSetInfos = (validate: Function, prop: TModifyTypes) => {
    const full = (prop + "Infos") as TModifyInfosTypes
    const ret = validate(rdata[full].value)

    if (prop === "mobile" && ret.ok && rdata[full].value === userInfo.mobile) {
      // 新老手机号相同了
      ret.ok = false
      ret.error = t("user.t50")
    }

    rdata[full] = {
      ...rdata[full],
      error: ret.error,
      ok: ret.ok
    }
    if (ret.reviseValue) {
      rdata[full].value = ret.reviseValue
    }
    if (ret.clear) {
      rdata[full].value = undefined
    }
    updateBtnStatus(prop)
  }

  const updateBtnStatus = (prop: TModifyTypes | "password") => {
    if (prop === "prevset") {
      rdata.presetBtnDisabled = !rdata.prevsetInfos.ok
    } else if (["mobile", "msgcode"].includes(prop)) {
      rdata.mobileBtnDisabled = !rdata.mobileInfos.ok || !rdata.msgcodeInfos.ok
    } else if (prop === "username") {
      rdata.nameBtnDisabled = !rdata.usernameInfos.ok
    } else if (prop === "password") {
      rdata.pwdBtnDisabled = !rdata.pwdInfos.ok || !rdata.repwdInfos.ok
    }
  }

  const nextStep = async () => {
    // 进行防抖处理
    rdata.presetBtnDisabled = true
    // 调接口
    console.log("调接口后进入下一步")
    // this.isCountingDown = false;
    // this.setStep = 2;
    try {
      await verifyLoggedSMSCode({
        smsBizType: rdata.setType === 1 ? 3 : 2,
        mobileCaptcha: rdata.prevsetInfos.value!
      })
      stopCountDown()
      rdata.setStep = 2
      rdata.presetBtnDisabled = false
    } catch (e) {
      console.log(e)
      rdata.presetBtnDisabled = false
    }
  }

  const saveNewMobile = async () => {
    // 进行防抖处理
    rdata.mobileBtnDisabled = true
    // 提交新手机号
    console.log(rdata.mobileInfos.value)
    try {
      await changeUserMobile({
        targetMobile: rdata.mobileInfos.value!,
        targetMobileCaptcha: rdata.msgcodeInfos.value!
      })
      rdata.mobileBtnDisabled = false
      getUser()
      closeSetModal()
      message(t("user.t52"))
    } catch (e) {
      console.log(e)
      rdata.mobileBtnDisabled = false
    }
  }

  const saveUsername = async () => {
    // 进行防抖处理
    rdata.nameBtnDisabled = true
    // 提交用户名
    console.log(rdata.usernameInfos.value)
    try {
      await changeUserName({
        name: rdata.usernameInfos.value!
      })
      rdata.nameBtnDisabled = false
      getUser()
      closeSetModal()
      message(t("user.t53"))
    } catch (e) {
      rdata.nameBtnDisabled = false
      console.log(e)
    }
  }

  const savePassword = async () => {
    // 进行防抖处理
    rdata.pwdBtnDisabled = true
    // 提交用户名
    console.log(rdata.pwd)

    try {
      await changeUserPassword({
        password: rdata.pwd,
        confirmPassword: rdata.repwd,
        mobileCaptcha: rdata.prevsetInfos.value!
      })
      rdata.pwdBtnDisabled = false
      getUser()
      closeSetModal()
      message(t("user.t54"))
    } catch (e) {
      console.log(e)
      rdata.pwdBtnDisabled = false
    }
  }

  const goLogout = () => {
    // 退出登录
    logout().then(() => {
      goLoginPage()
    })
  }

  const validatePwd = (valid: boolean, value: string) => {
    if (valid) {
      rdata.pwd = value
      rdata.pwdInfos.ok = true
    } else {
      rdata.pwd = ""
      rdata.pwdInfos.ok = false
    }
    updateBtnStatus("password")
  }

  const validateRepwd = (valid: boolean, value: string) => {
    if (valid) {
      rdata.repwd = value
      rdata.repwdInfos.ok = true
    } else {
      rdata.repwdInfos.ok = false
    }
    updateBtnStatus("password")
  }

  const countDownFinished = () => {
    stopCountDown()
  }
</script>

<style lang="less">
  .nt-account-set {
    .user-infos-down {
      padding: 20px 24px;
      // .upload-tip {
      //   margin-top: 8px;
      //   font-size: 14px;
      //   color: #333;
      // }
      .upload-comp {
        display: none;
      }

      .user-infos {
        .user-info-item {
          height: 102px;
          background: #f7f9fc;
          border-radius: 6px;
          margin-bottom: 8px;
          .left-area {
            flex: 1;
            border-right: 1px solid #e8e8e8;
            height: 48px;
            padding-left: 20px;
            font-weight: 400;
            font-size: 14px;
            .user-avatar {
              width: 52px;
              height: 52px;
              flex-shrink: 0;
              margin-right: 22px;
            }
            .item-pic {
              width: 40px;
              height: 40px;
              flex-shrink: 0;
              margin-right: 28px;
              margin-left: 6px;
            }
            .item-label {
              color: #333;
              margin-right: 100px;
            }
            .item-content {
              padding-right: 10px;
              color: #999;
              flex: 1;
            }
          }
          .right-area {
            width: 13%;
            height: 48px;
            padding-left: 2.5%;
            span {
              padding: 5px 10px;
              font-size: 16px;
              color: @MainColor;
            }
          }
        }
      }
    }
    .account-set-modal {
      &.el-dialog {
        width: 400px;
        // height: 216px;
        border-radius: 6px;
        padding: 0;
        margin-top: 0 !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
      }
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333;
        .account-set-modal-inner {
          .modal-title {
            height: 40px;
            padding: 0 22px;
            font-size: 14px;
            border-bottom: 1px solid #e8e8e8;
            .close-icon {
              width: 14px;
            }
          }
          .modal-body {
            .modal-body-content {
              height: 100px;
              padding-left: 22px;
              border-bottom: 1px solid #e8e8e8;
            }
          }
          .step-2 {
            .modal-body-content {
              height: 110px;
            }
          }
          .set-step-btn {
            height: 56px;
            width: 100%;
            padding: 0 30px 0 0;
            // .el-button {
            //   // width: 100%;
            // }
          }
          .nt-input-item {
            position: relative;
            padding: 0 0 20px 0;
            width: 100%;
            max-width: 270px;
            &.without-pb {
              padding-bottom: 0;
            }
            &.with-button {
              .el-input__inner {
                padding-right: 100px;
              }
            }
            &.is-error {
              .el-input__inner {
                border-color: #f56c6c;
              }
              .err-msg {
                position: absolute;
                left: 0;
                bottom: 4px;
                line-height: 1;
                font-size: 12px;
                color: #f5222d;
                letter-spacing: 0;
              }
            }
            .el-input {
              flex: 1;
            }
            .msg-code-btn {
              position: absolute;
              right: 1px;
              top: 1px;
              width: 86px;
              height: 34px;
              background: #f0f5ff;
              border-radius: 4px;
              font-size: 14px;
              color: @MainColor;
              .el-button {
                border: none;
                background: transparent;
                font-size: 14px;
                color: @MainColor;
                letter-spacing: 0;
                padding: 0;
                height: 34px;
                line-height: 34px;
                text-align: center;
                span {
                  font-weight: 400;
                }
              }
            }
            .icons-group {
              width: 32px;
              padding-right: 4px;
            }
          }
          .set-pwd-inputs {
            .nt-input-item {
              padding: 0;
              .input-wrapper {
                .err-msg {
                  position: absolute;
                  left: 0;
                  top: calc(100% + 4px);
                  line-height: 1;
                  color: #f5222d;
                  font-size: 12px;
                }
                .icons-group {
                  width: 17px;
                  padding: 0;
                }
              }
            }
          }
        }
      }
    }
  }
</style>

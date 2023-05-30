<template>
  <div class="login">
    <div class="login-home-header flex-start">
      <div class="login-logo">
        <svg-icon
          name="logo"
          color="#ff0"
        />
      </div>
    </div>

    <div class="login-home flex-v">
      <div class="login-home-body flex-v">
        <img
          class="login-main-pic"
          src="../../assets/imgs/login_main_pic.png"
        />
        <div class="login-frame">
          <img
            src="../../assets/imgs/frame.png"
            alt=""
            class="login-frame-pic"
          />
        </div>
        <div class="login-input-area">
          <LoginRegister />
        </div>
        <div class="company-detail flex-center">
          <div class="beian flex-center">
            <img
              class="response-img"
              style="width: 15px"
              src="../../assets/imgs/beianlogo.png"
              alt=""
            />
            <span
              class="pointer"
              @click="goBeianGov(1)"
            >
              {{ $t("common.beian_public") }}
            </span>
          </div>
          <span
            class="pointer beian"
            @click="goBeianGov(2)"
          >
            {{ $t("common.beian_icp") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import LoginRegister from "./LoginRegister.vue"
  import { ICPBeianGov, PublicBeianGov } from "../../utils/jump"

  const goBeianGov = (val: number) => {
    if (val === 1) {
      PublicBeianGov()
    } else if (val === 2) {
      ICPBeianGov()
    }
  }
</script>
<style lang="less">
  .login {
    position: relative;
    min-width: 956px;
  }
  .login-logo {
    position: absolute;
    top: 15px;
    left: 40px;
    color: @MainColor;
    height: 64px;
    display: flex;
    z-index: 10;
    svg {
      width: 92px;
      height: 30px;
    }
  }
  .login-home {
    width: 100%;
    height: 100vh;

    .login-home-body {
      position: relative;
      width: 100%;
      flex: 1;
      .login-main-pic {
        width: 100%;
        height: 100vh;
      }
      .login-frame {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 6%;
        width: 40%;
        display: flex;
        justify-content: center;
        .login-frame-pic {
          width: 100%;
        }
      }
      .login-input-area {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        width: 46%;
        display: flex;
        justify-content: center;
      }
      .company-detail {
        position: absolute;
        right: 0;
        width: 46%;
        bottom: 8px;
        font-weight: 400;
        font-size: 12px;
        color: #333;
        letter-spacing: 0;
        .beian {
          margin-right: 30px;
          .response-img {
            max-width: 100%;
          }
        }
      }
    }
  }

  .geetest_box_wrapV4 .geetest_box .geetest_footer {
    .geetest_footer_left .geetest_feedback {
      display: none !important;
    }
    .geetest_footer_right {
      display: none !important;
    }
  }
  .geetest_box_wrap .geetest_box .geetest_footer {
    .geetest_footer_left .geetest_feedback {
      display: none !important;
    }
    .geetest_footer_right {
      display: none !important;
    }
  }
  .el-input {
    input {
      &:hover {
        border-color: rgba(98, 93, 245, 0.2);
      }
      &:focus {
        border-color: @MainColor;
      }
    }
  }
</style>

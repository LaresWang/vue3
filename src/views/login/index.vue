<template>
  <div class="login">
    <div class="login-logo">
      <svg-icon
        name="logo"
        color="#ff0"
      />
    </div>

    <div class="login-home">
      <div class="login-home-body flex-center">
        <div
          class="login-home-left"
          ref="loginLeft"
        ></div>
        <div class="login-home-right">
          <div class="login-input-area flex-center">
            <LoginRegister />
          </div>
          <div class="company-detail flex-center">
            <div class="beian flex-center">
              <img
                class="response-img"
                style="width: 15px"
                src="@/assets/imgs/beianlogo.png"
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
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted } from "vue"
  import LoginRegister from "./components/LoginRegister.vue"
  import { ICPBeianGov, PublicBeianGov } from "@/utils/jump"

  const loginLeft = ref<HTMLElement>()

  onMounted(() => {
    if (!loginLeft.value) {
      return
    }
    loginBgPicHandler()
    const resizeEL = new ResizeObserver(loginBgPicHandler)
    resizeEL.observe(loginLeft.value)
    // loginLeft.value.onresize = loginBgPicHandler
  })

  const loginBgPicHandler = () => {
    const el = loginLeft.value!
    const whrate = el.offsetWidth / el.offsetHeight
    // 背景图片的宽高比
    const baserate = 770 / 900
    console.log(whrate, baserate)
    if (whrate > baserate) {
      el.style.backgroundSize = "100%"
    } else {
      el.style.backgroundSize = "auto 100%"
    }
  }

  const goBeianGov = (val: number) => {
    if (val === 1) {
      PublicBeianGov()
    } else if (val === 2) {
      ICPBeianGov()
    }
  }
</script>
<style lang="less">
  @import url(@/assets/css/login.less);
</style>

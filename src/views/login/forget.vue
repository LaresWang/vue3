<template>
  <div>
    <div class="login-logo">
      <svg-icon
        name="logo"
        color="#ff0"
      />
    </div>
    <div class="login-home">
      <div class="login-home-body flex-center">
        <div class="login-home-left"></div>
        <div class="login-home-right">
          <div class="forget-pwd-input-area flex-center">
            <ForgetPwd />
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
  import ForgetPwd from "./components/ForgetPwd.vue"
  import { ICPBeianGov, PublicBeianGov } from "@/utils/jump"

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

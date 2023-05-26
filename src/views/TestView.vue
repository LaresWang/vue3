<script setup lang="ts">
import { onMounted } from "vue"
// 路由跳转的两种实现方式
import {useRouter} from "vue-router"
// import { useI18n } from "vue-i18n"
// import router from "../router"
import {heartBeat} from "../api/user"

import ThemeColor from "../components/ThemeColorsTest.vue"
import Language from "../components/Languge.vue"

console.log(import.meta)
console.log(import.meta.env)
console.log(APP_ENV)
console.info(1)
console.warn(2)
console.error(3)
withDefaults(defineProps<{
  title?: string // 定义组建接收绑定的传参
}>(), {
  title: "defalut title"
})
// const { t } = useI18n()
// console.log(t("test"))
onMounted(async () => {
  const res = await heartBeat({
    instanceId: '111'
  })
  console.log(res)
});
// const jump = function(){
//   router.push("/about")
// }

const uRouter = useRouter()
const jump2 = function() {
  uRouter.push("/about")
}
</script>

<template>
<ThemeColor>
  asdaaa
  <main class="main sub">
    <Language />
    <div class="title">{{ title }}</div>
    <div>{{ $t("test") }}</div>
    <!-- <TheWelcome /> -->
    <!-- <ElButton type="primary" @click="jump">tiaozhuan1</ElButton> -->
    <ElButton type="success" @click="jump2">tiaozhuan2</ElButton>
  </main>
</ThemeColor>
</template>

<style lang="less">
.main{
  color: @MainColor;
  .title {
    color: #ff00ff;
  }
  &.sub{
    font-size: 30px;
  }
}
</style>

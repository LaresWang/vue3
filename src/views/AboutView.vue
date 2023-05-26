<template>
  <div class="about">
    <iframe :src="playUrl" frameborder="0" scrolling="no" seamless width="100%" height="100%"></iframe>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue"
// import webrtcSDK from "webrtcsdk_new"
const playUrl = ref("")
playUrl.value = "http://10.50.8.83:91/player/home?appKey=I543854Mi05P7R2FN6sk1bht&linkType=1"

</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

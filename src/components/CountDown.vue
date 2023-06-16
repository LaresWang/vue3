<template>
  <span>{{ count }}s</span>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from "vue"
  import type { TInterval } from "@/types"

  const props = withDefaults(
    defineProps<{
      startNum: number
    }>(),
    {
      startNum: 60
    }
  )

  const emits = defineEmits(["done"])

  const count = ref(props.startNum)
  let timmer: TInterval = 0

  onMounted(() => {
    timmer = setInterval(() => {
      count.value--
      if (count.value === 0) {
        emits("done")
        clearInterval(timmer)
      }
    }, 1000)
  })

  onBeforeUnmount(() => {
    clearInterval(timmer)
  })
</script>

<style></style>

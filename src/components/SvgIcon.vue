<template>
  <svg
    :class="svgClass"
    :fill="color"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>
<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(defineProps<{
  name: string,
  prefix: string
  color: string
}>(), {
  prefix: "icon",
  color: "#none"
})

const iconName = computed(()=>`#${props.prefix}-${props.name}`)
const svgClass = computed(()=>"svg-icon svg-icon-" + props.name)

</script>
<style lang="less">
.svg-icon {
  width: 1em;
  height: 1em;
}
</style>

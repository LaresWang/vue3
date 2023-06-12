<template>
  <div class="slider-groups">
    <!-- 一级标题 -->
    <div
      v-for="item in data"
      :key="item.code"
      class="slider-groups-wrapper"
      @click="expandLists(item.code)"
    >
      <div class="level-one-list flex-between">
        <span>{{ item.name }}</span>
        <span>
          <el-icon>
            <ArrowRight v-if="expandCode !== item.code" />
            <ArrowDown v-if="expandCode === item.code" />
          </el-icon>
        </span>
      </div>

      <div v-show="expandCode === item.code">
        <div
          v-for="list in item.detail"
          :key="list.code"
          class="level-two-list"
        >
          {{ list.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue"
  import { ArrowRight, ArrowDown } from "@element-plus/icons-vue"
  import type { TBodyPartPositionDetail } from "@/types/human"

  const props = defineProps<{
    data: TBodyPartPositionDetail[]
  }>()

  const expandCode = ref("")
  const expandLists = (code: string) => {
    expandCode.value = expandCode.value === code ? "" : code
  }
</script>
<style lang="less">
  .slider-groups {
    width: 100%;
    .slider-groups-wrapper {
      padding-left: 6px;
      padding-right: 10px;
      .level-one-list {
        padding: 0 20px;
        height: 64px;
      }
    }
  }
</style>

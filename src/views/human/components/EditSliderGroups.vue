<template>
  <div class="slider-groups">
    <div class="slider-groups-wrapper">
      <!-- 一级标题 -->
      <div
        v-for="item in props.data"
        :key="item.code"
        class="slider-group-item"
      >
        <div
          class="level-one-list pointer flex-between"
          @click="expandLists(item.code)"
        >
          <span>{{ item.name }}</span>
          <span class="fix-el-icon">
            <el-icon>
              <ArrowRight v-if="expandCode !== item.code" />
              <ArrowDown v-if="expandCode === item.code" />
            </el-icon>
          </span>
        </div>

        <div
          class="level-two-lists"
          v-show="expandCode === item.code"
        >
          <div
            v-for="list in item.detail"
            :key="list.code"
            class="level-two-list flex-v"
          >
            <div class="level-two-title flex-between">
              <span>{{ list.name }}</span>
              <div class="fix-show-adjust-value">
                <el-input v-model="currentAdjustValues[list.code]" />
              </div>
            </div>
            <div class="slider-area">
              <el-slider
                v-model="currentAdjustValues[list.code]"
                :min="+list.range.left_value"
                :max="+list.range.right_value"
                :step="0.01"
                class="fix-slider-body"
                tooltip-class="fix-slider-tip"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect, onMounted, onBeforeUnmount } from "vue"
  import { ArrowRight, ArrowDown } from "@element-plus/icons-vue"
  import type { TBodyPartPositionDetail } from "@/types/human"

  const props = defineProps<{
    data: TBodyPartPositionDetail[]
  }>()

  const expandCode = ref("")
  const currentAdjustValues = ref<{
    [x: string]: number
  }>({})
  // 初始化数值
  watchEffect(() => {
    currentAdjustValues.value = {}
    // 取二级的数据
    props.data?.forEach((subData) => {
      /** subData
       * {
          name: "整体",
          code: "001-001",
          detail: []
       }
       */
      subData.detail.forEach((item) => {
        /**
         * item 
         * {
              name: "扁头",
              setting_mode: 0,
              code: "001-001-001-001",
              cmd_code: "CMD01001",
              range: {
                left_value: "-1",
                right_value: "1",
                inclusive_left_range: "1",
                inclusive_right_range: "1",
                scale: 8
              }
            },
         */
        currentAdjustValues.value[item.code] = (+item.range.left_value + +item.range.right_value) / 2
      })
    })
  })

  const expandLists = (code: string) => {
    expandCode.value = expandCode.value === code ? "" : code
  }

  /** VVVVV  点击拖动滑块的时候背景色变色处理 VVVVVV */
  let sliderWrapperEl: HTMLDivElement | null = null
  let sliderBody: HTMLElement | null = null
  let clickedTargetEl = false

  const registerSliderMouseEvents = () => {
    sliderWrapperEl = document.querySelector(".slider-groups-wrapper")
    if (sliderWrapperEl) {
      sliderWrapperEl.addEventListener("mousedown", handleSliderMouseEvents)
      sliderWrapperEl.addEventListener("mouseup", handleSliderMouseUpEvents)
    }
  }

  const removeSliderMouseEvents = () => {
    if (sliderWrapperEl) {
      sliderWrapperEl.removeEventListener("mousedown", handleSliderMouseEvents)
      sliderWrapperEl.removeEventListener("mouseup", handleSliderMouseUpEvents)
    }
  }

  const handleSliderMouseEvents = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const classList = target.classList
    if (classList?.contains("el-slider__runway")) {
      clickedTargetEl = true
      sliderBody = target
      target.style.backgroundColor = "#fff"
    } else if (classList?.contains("el-slider__button") || classList?.contains("el-slider__bar")) {
      clickedTargetEl = true
      let parentEl = target.parentElement
      while (parentEl) {
        const classlist = parentEl.classList
        if (classlist.contains("el-slider__runway")) {
          parentEl.style.backgroundColor = "#fff"
          sliderBody = parentEl
          parentEl = null
        } else {
          parentEl = parentEl.parentElement
        }
      }
    }
  }

  const handleSliderMouseUpEvents = () => {
    // if (clickedTargetEl) {
    //   const els = document.querySelectorAll<HTMLElement>(".fix-slider-body .el-slider__runway")
    //   if (els?.length) {
    //     els.forEach((el) => {
    //       el.style.backgroundColor = "#3a3a3a"
    //     })
    //   }
    // }
    if (clickedTargetEl && sliderBody) {
      sliderBody.style.backgroundColor = "#3a3a3a"
    }
    clickedTargetEl = false
    sliderBody = null
  }

  /** ^^^^^^  点击拖动滑块的时候背景色变色处理 ^^^^^^^^^ */

  onMounted(() => {
    registerSliderMouseEvents()
  })

  onBeforeUnmount(() => {
    removeSliderMouseEvents()
  })
</script>
<style lang="less">
  .slider-groups {
    width: 100%;
    height: 100%;
    font-size: 12px;
    padding-right: 5px;
    padding-left: 2px;
    overflow: hidden;
    .slider-groups-wrapper {
      width: 100%;
      height: 100%;
      padding-right: 5px;
      overflow: auto;
      .slider-group-item {
        .level-one-list {
          height: 64px;
          padding: 0 30px;
          font-weight: 500;
          color: var(--c-white-1);
          margin-bottom: 2px;
          background: var(--c-black-5);
          .fix-el-icon {
            .el-icon {
              font-size: 14px;
              color: var(--c-gray-1);
            }
          }
        }
        .level-two-lists {
          padding-top: 10px;
          padding-bottom: 20px;
          .level-two-list {
            width: 100%;
            height: 60px;
            padding: 0 12px 0 18px;
            margin-top: 5px;
            .level-two-title {
              width: 100%;
              .fix-show-adjust-value {
                // width: fit-content;
                width: 65px;
                height: 20px;
                .el-input {
                  width: 100%;
                  height: 100%;
                }
                .el-input__wrapper {
                  padding: 0 5px;
                  background-color: var(--c-gray-4);
                  box-shadow: none;
                  border-radius: 2px;
                  font-size: 12px;
                  .el-input__inner {
                    line-height: 0;
                    border: none;
                    text-align: center;
                    color: var(--c-white-1);
                  }
                }
              }
            }
            .slider-area {
              width: 100%;
              margin-top: 5px;
              .fix-slider-body {
                height: 10px;
                // &:hover {
                //   .el-slider__runway {
                //     background-color: var(--c-white-1);
                //   }
                // }
                .el-slider__runway {
                  height: 4px;
                  background-color: var(--c-gray-7);
                  .el-slider__bar {
                    background-color: transparent;
                    height: 4px;
                  }
                  .el-slider__button-wrapper {
                    height: 10px;
                    width: 10px;
                    top: -7px;
                    .el-slider__button {
                      height: 10px;
                      width: 10px;
                      border-color: var(--el-color-white);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>

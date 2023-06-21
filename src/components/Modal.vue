<template>
  <div
    class="fix-modal-common flex-center"
    v-if="props.show"
  >
    <div class="modal-wrapper">
      <div class="header flex-center">
        {{ props.title }}
      </div>
      <div class="body flex-center">
        <svg-icon
          v-if="props.type === 1"
          name="icon_tips_y"
        />
        <span>{{ props.content }}</span>
      </div>
      <div class="footer flex-end">
        <el-button
          class="cancel-btn"
          @click="cancel"
        >
          {{ $t("common.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="confirm"
        >
          {{ $t("common.confirm") }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      show: boolean
      id?: string | number
      title: string
      content: string
      // 0-纯文本提示 1-带有warning图标
      type: 0 | 1 | 2
    }>(),
    {
      show: false,
      title: "",
      content: "",
      type: 0
    }
  )

  const emits = defineEmits(["update:show", "confirm"])

  const cancel = () => {
    console.log("cancel")
    emits("update:show", false)
  }

  const confirm = () => {
    console.log("confirm")
    emits("confirm", props.id)
  }
</script>
<style lang="less">
  .fix-modal-common {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    .modal-wrapper {
      width: 315px;
      // height: 200px;
      background: var(--c-black-8);
      border-radius: 4px;
      overflow: hidden;
      font-weight: 500;
      font-size: 14px;
      color: var(--c-white-1);
      .header {
        height: 44px;
        background: var(--c-black-4);
      }
      .body {
        height: 96px;
        margin: 1px 0;
        background: var(--c-black-4);
        .svg-icon {
          width: 14px;
          height: 14px;
          margin-right: 8px;
        }
      }
      .footer {
        height: 56px;
        padding-right: 24px;
        background: var(--c-black-4);
        .el-button {
          width: 70px;
          height: 28px;
          margin-left: 8px !important;
          color: var(--c-white-1);
          &.cancel-btn {
            background-color: var(--c-gray-4);
            border-color: var(--c-gray-4);
          }
        }
      }
    }
  }
</style>

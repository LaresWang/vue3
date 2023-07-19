<template>
  <div class="fix-short-cuts">
    <div
      class="short-cuts-body"
      v-show="!isCollapsed"
    >
      <div class="short-cuts-title">
        {{ $t("edit.t10") }}
      </div>
      <div class="short-cuts-lists">
        <table>
          <tr
            v-for="list in shortcuts"
            :key="list.value"
          >
            <td class="list-label">{{ list.label }}</td>
            <td class="list-value">{{ list.value }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div
      class="toggle-icon"
      @click="toggle"
    >
      <svg-icon
        name="icon_keyboard"
        :class="!isCollapsed ? 'active' : ''"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue"

  const isCollapsed = ref(true)

  const shortcuts = [
    {
      label: "聚焦点",
      value: "单击鼠标右键"
    },
    {
      label: "环绕",
      value: "长按鼠标右键"
    },
    // {
    //   label: "平移/环绕",
    //   value: "鼠标中键"
    // },
    {
      label: "平移",
      value: "ALT + 鼠标中键"
    },
    {
      label: "缩放",
      value: "ALT + 鼠标右键"
    },
    // {
    //   label: "移动雕刻点",
    //   value: "鼠标左键"
    // }
    {
      label: "面部镜头",
      value: "1"
    },
    {
      label: "全身镜头",
      value: "2"
    }
  ]

  const toggle = () => {
    isCollapsed.value = !isCollapsed.value
  }
</script>
<style lang="less">
  .fix-short-cuts {
    position: absolute;
    right: 24px;
    top: 180px;
    .short-cuts-body {
      position: absolute;
      width: 264px;
      right: 40px;
      top: 0;
      .short-cuts-title {
        height: 42px;
        line-height: 42px;
        padding-left: 38px;
        font-weight: 500;
        font-size: 16px;
        background: var(--c-black-7);
        border-radius: 4px;
        margin-bottom: 2px;
      }
      .short-cuts-lists {
        font-weight: 500;
        font-size: 10px;
        padding: 16px 0;
        color: var(--c-gray-1);
        background: var(--c-black-7);
        border-radius: 4px;
        overflow: hidden;
        table {
          width: 100%;
          tr {
            width: 100%;
            td {
              width: 50%;
              &.list-label {
                text-align: right;
                padding-right: 25px;
              }
              &.list-value {
                padding-left: 5px;
                color: var(--c-blue-1);
              }
            }
          }
        }
      }
    }
    .toggle-icon {
      width: 32px;
      height: 100%;

      .svg-icon {
        width: 100%;
        height: 32px;
        fill: var(--c-white-1);
        &.active {
          fill: var(--c-blue-1);
        }
      }
    }
  }
</style>

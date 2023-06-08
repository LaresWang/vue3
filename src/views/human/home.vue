<template>
  <div class="human-home flex-between">
    <div class="human-edit-area flex-between">
      <div>
        <!-- 根据导航栏上的编辑按钮动态切换左边的菜单组件 -->
      </div>
      <div>
        <!-- 根据 默认显示模型列表， 导航栏上的编辑按钮动态切换下面的组件 -->
        <!-- 这里放置 模型列表/模型编辑/表情/动作 组件切换 -->
      </div>
    </div>
    <div class="human-player-area">video</div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="less">
  .human-home {
    width: 100%;
    height: 100%;
    .human-edit-area {
      flex: 1;
      height: 100%;
      padding-top: 4px;
    }
    .human-player-area {
      width: 975px;
      height: 100%;
      color: var(--c-white-1);
    }
  }
</style>

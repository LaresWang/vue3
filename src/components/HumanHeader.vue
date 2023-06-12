<template>
  <div class="fix-human-header flex-between">
    <div class="left-menus-area flex-start">
      <svg-icon
        name="logo"
        class="human-header-logo"
      />
      <div
        v-if="breadMenus.length > 1"
        class="header-breadcrumb-menus flex-start"
      >
        <svg-icon
          class="breadcrumb-menus-return-icon"
          name="icon_return"
        />
        <template
          v-for="(menu, idx) in breadMenus"
          :key="menu.id!"
        >
          <!-- 最后一级肯定不能跳转 -->
          <span
            class="bread-menu-item"
            :class="menu.canJump && idx !== breadMenus.length - 1 ? 'can-jump pointer' : ''"
            @click="breadMenusJump(idx)"
          >
            {{ menu.label }}
          </span>
          <span
            v-if="idx !== breadMenus.length - 1"
            class="menu-separator"
          >
            /
          </span>
        </template>
      </div>
      <div
        v-if="breadMenus.length > 1 && editMenus.length"
        class="header-edit-menus flex-start"
      >
        <el-button
          class="edit-save-btn"
          type="primary"
        >
          保存
        </el-button>
        <template
          v-for="item in editMenus"
          :key="item.id"
        >
          <span
            v-if="item.icon && item.iconType === 'svg'"
            class="edit-menu-icon flex-center"
            :class="selectedEditCompNameStore.selectedCompName === item.value ? 'active' : 'pointer'"
            @click="changeEditContent(item.value)"
          >
            <svg-icon :name="item.icon" />
          </span>
          <img
            v-else-if="item.icon && item.iconType === 'image'"
            class="edit-menu-icon flex-center"
            :class="selectedEditCompNameStore.selectedCompName === item.value ? 'active' : 'pointer'"
            :src="item.icon"
            @click="changeEditContent(item.value)"
            alt=""
          />
          <span v-else>
            {{ item.label }}
          </span>
        </template>
      </div>
    </div>

    <div
      class="user-info-area flex-center pointer"
      @click="goToUserCenter"
    >
      <Avatar
        class="nav-avatar"
        :url="userInfo.userAvatar"
      />
      <span class="user-name single-line-text-ellipsis">{{ userInfo.userName }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { watch } from "vue"
  import { goUserCenter } from "@/utils/jump"
  import useUserInfoStore from "@/stores/user"
  import { useBreadcrumbMenusStore, useEidtHumanMenusStore, useSelectedEditCompNameStore } from "@/stores/menus"
  import { EEditCompName } from "@/types/menus.d"

  import Avatar from "./Avatar.vue"

  const { userInfo } = useUserInfoStore()
  const { breadMenus, jumpPrevMenu } = useBreadcrumbMenusStore()
  const { editMenus, clearEditMenus, addEditMenus } = useEidtHumanMenusStore()
  const selectedEditCompNameStore = useSelectedEditCompNameStore()

  watch(editMenus, () => {
    selectedEditCompNameStore.initSelectCompName()
  })

  const goToUserCenter = () => {
    goUserCenter()
  }

  const breadMenusJump = (idx: number) => {
    if (idx === breadMenus.length - 1) {
      return
    }
    jumpPrevMenu(idx)
  }

  clearEditMenus()
  addEditMenus([
    {
      value: EEditCompName.EditHeaderPart,
      iconType: "svg",
      icon: "icon_face"
      // selected: false
    },
    {
      value: EEditCompName.EditEmotions,
      iconType: "svg",
      icon: "icon_expression"
    },
    {
      value: EEditCompName.EditActions,
      iconType: "svg",
      icon: "icon_action"
      // selected: true
    }
  ])

  const changeEditContent = (name: EEditCompName) => {
    if (selectedEditCompNameStore.selectedCompName === name) {
      return
    }
    selectedEditCompNameStore.setSelectCompName(name)
  }
</script>
<style lang="less">
  .fix-human-header {
    height: 100%;
    padding: 0 20px;
    .left-menus-area {
      height: 100%;
      .human-header-logo {
        height: 40px;
        width: 80px;
      }
      .header-breadcrumb-menus {
        margin-left: 25px;
        font-size: 14px;
        color: var(--c-white-1);
        .breadcrumb-menus-return-icon {
          margin-right: 10px;
        }
        .bread-menu-item {
        }
      }
      .header-edit-menus {
        height: 100%;
        margin-left: 90px;
        .edit-save-btn {
          margin: 0 10px;
          height: 28px;
          width: 72px;
        }
        .edit-menu-icon {
          height: 100%;
          width: 50px;
          .svg-icon {
            width: 28px;
            height: 28px;
            fill: var(--c-white-1);
          }
          &.active {
            background: var(--c-black-11);
            .svg-icon {
              fill: var(--c-blue-1);
            }
          }
        }
      }
    }
    .user-info-area {
      height: 100%;
      .nav-avatar {
        width: 24px;
        height: 24px;
      }
      .user-name {
        margin-left: 8px;
        font-size: 14px;
        max-width: 100px;
        color: var(--c-white-1);
      }
    }
  }
</style>

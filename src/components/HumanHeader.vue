<template>
  <div class="fix-human-header human-header flex-start">
    <div class="left-menus-area flex-start">
      <svg-icon
        name="logo"
        class="human-header-logo"
      />
      <div
        v-if="breadcrumbMenusStore.breadMenus.length > 1"
        class="header-breadcrumb-menus flex-start"
      >
        <svg-icon
          class="breadcrumb-menus-return-icon pointer"
          name="icon_return"
          @click="back()"
        />
        <template
          v-for="(menu, idx) in breadcrumbMenusStore.breadMenus"
          :key="menu.id!"
        >
          <!-- 最后一级肯定不能跳转 -->
          <span
            class="bread-menu-item single-line-text-ellipsis"
            :class="menu.canJump && idx !== breadcrumbMenusStore.breadMenus.length - 1 ? 'can-jump pointer' : ''"
            @click="breadMenusJump(idx)"
          >
            {{ menu.label }}
          </span>
          <span
            v-if="idx !== breadcrumbMenusStore.breadMenus.length - 1"
            class="menu-separator"
          >
            /
          </span>
        </template>
      </div>
      <div
        v-if="breadcrumbMenusStore.breadMenus.length > 1 && editMenus.length"
        class="header-save-menu flex-start"
      >
        <el-button
          class="edit-save-btn"
          type="primary"
          @click="saveModel"
          :disabled="saveHumanModelStore.isSaving"
        >
          {{ $t("edit.t5") }}
        </el-button>
      </div>
    </div>

    <div class="right-menus-area flex-end">
      <div
        class="edit-menus flex-start"
        v-if="breadcrumbMenusStore.breadMenus.length > 1"
      >
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
      <el-dropdown
        class="user-nav-body"
        popper-class="fix-user-nav-popper-body"
      >
        <div class="user-info-title flex-center">
          <Avatar
            class="nav-avatar"
            :url="userInfoStore.userInfo?.userAvatar"
          />
          <span class="user-name single-line-text-ellipsis">{{ userInfoStore.userInfo?.userName }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-nav-items-wrapper">
            <el-dropdown-item class="user-nav-item first">
              <div class="user-nav-item-inner flex-center">
                <div class="left-icon flex-center">
                  <Avatar
                    class="nav-item-avatar"
                    :url="userInfoStore.userInfo?.userAvatar"
                  />
                </div>
                <div class="right-text single-line-text-ellipsis">
                  {{ userInfoStore.userInfo?.userName }}
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item class="user-nav-item">
              <div
                class="user-nav-item-inner flex-center"
                @click="goToUserCenter"
              >
                <div class="left-icon flex-center">
                  <svg-icon name="icon_set_up"></svg-icon>
                </div>
                <div class="right-text single-line-text-ellipsis">
                  {{ $t("user.t56") }}
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item class="user-nav-item">
              <div
                class="user-nav-item-inner flex-center"
                @click="loginOut"
              >
                <div class="left-icon flex-center">
                  <svg-icon name="icon_exit"></svg-icon>
                </div>
                <div class="right-text single-line-text-ellipsis">
                  {{ $t("user.t57") }}
                </div>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <Modal
      v-model:show="showLoginoutModal"
      :title="$t('user.t57')"
      :content="$t('user.t58')"
      :type="1"
      @confirm="confirmLoginout"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from "vue"
  import { logout } from "@/api/user"
  import { goLoginPage, goUserCenter } from "@/utils/jump"
  import useUserInfoStore from "@/stores/user"
  import { useBreadcrumbMenusStore, useEidtHumanMenusStore, useSelectedEditCompNameStore } from "@/stores/menus"
  import { EEditCompName } from "@/types/menus.d"
  import { useSaveHumanModelStore } from "@/stores/human"

  import Avatar from "./Avatar.vue"
  import Modal from "./Modal.vue"

  const showLoginoutModal = ref(false)
  const userInfoStore = useUserInfoStore()
  const breadcrumbMenusStore = useBreadcrumbMenusStore()
  const { editMenus, clearEditMenus, addEditMenus } = useEidtHumanMenusStore()
  const selectedEditCompNameStore = useSelectedEditCompNameStore()
  const saveHumanModelStore = useSaveHumanModelStore()

  // watch(editMenus, () => {
  //   selectedEditCompNameStore.initSelectCompName()
  // })

  const goToUserCenter = () => {
    goUserCenter()
  }

  const loginOut = () => {
    showLoginoutModal.value = true
  }

  const confirmLoginout = async () => {
    await logout()
    showLoginoutModal.value = false
    goLoginPage()
  }

  const breadMenusJump = (idx: number) => {
    if (idx === breadcrumbMenusStore.breadMenus.length - 1) {
      return
    }
    breadcrumbMenusStore.jumpPrevMenu(idx)
  }

  const back = () => {
    // 既然出现回退按钮  长度肯定大于等于2
    breadcrumbMenusStore.jumpPrevMenu(breadcrumbMenusStore.breadMenus.length - 2)
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

  const saveModel = () => {
    if (saveHumanModelStore.isSaving) {
      return
    }
    saveHumanModelStore.save()
  }
</script>
<style lang="less">
  .fix-human-header {
    height: 100%;
    padding: 0;
    .left-menus-area {
      padding-left: 20px;
      height: 100%;
      flex: 1;
      overflow: hidden;
      .human-header-logo {
        height: 40px;
        width: 80px;
      }
      .header-breadcrumb-menus {
        flex: 1;
        font-size: 14px;
        color: var(--c-white-1);
        .breadcrumb-menus-return-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        .bread-menu-item {
          max-width: 35%;
        }
      }
      .header-save-menu {
        height: 100%;
        .edit-save-btn {
          height: 28px;
          padding: 0;
          border-radius: 4px !important;
          max-width: 90px;
        }
      }
    }
    .right-menus-area {
      padding-right: 20px;
      height: 100%;
      .edit-menus {
        flex: 1;
        height: 100%;
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
      .user-nav-body {
        // height: 100%;
        padding: 13px 0;
        .user-info-title {
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
    }
  }
  .header-breadcrumb-menus {
    margin-left: 25px;
    max-width: 248px;
    .breadcrumb-menus-return-icon {
      margin-right: 10px;
    }
  }
  .header-save-menu {
    .edit-save-btn {
      margin: 0 10px;
      width: 72px;
    }
  }
  .right-menus-area {
    width: var(--right-area-width);
  }
</style>

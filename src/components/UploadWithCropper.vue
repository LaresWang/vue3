<template>
  <div class="upload-cropper">
    <div
      v-if="cropperOption.img"
      class="cropper-wrapper flex-v"
    >
      <div class="cropper-area">
        <VueCropper
          ref="cropper"
          :img="cropperOption.img"
          :output-size="cropperOption.outputSize"
          :output-type="cropperOption.outputType"
          :info="true"
          :full="cropperOption.full"
          :can-move="cropperOption.canMove"
          :can-move-box="cropperOption.canMoveBox"
          :fixed-box="cropperOption.fixedBox"
          :original="cropperOption.original"
          :auto-crop="cropperOption.autoCrop"
          :auto-crop-width="cropperOption.autoCropWidth"
          :auto-crop-height="cropperOption.autoCropHeight"
          :center-box="cropperOption.centerBox"
          :high="cropperOption.high"
          :info-true="cropperOption.infoTrue"
          :enlarge="cropperOption.enlarge"
        />
      </div>
      <div class="btn-group">
        <el-button @click="startUpload">确定</el-button>
      </div>
    </div>
    <el-upload
      ref="uploadRef"
      action="#"
      class="avatar-uploader flex-center pointer"
      :show-file-list="false"
      :before-upload="beforeUpload"
      v-bind="$attrs"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="avatar"
      />
      <div
        v-else
        class="preupload-tip flex-v"
      >
        <el-icon class="el-icon-plus avatar-uploader-icon">
          <Plus />
        </el-icon>
        <span>{{ $t("upload.t1") }}</span>
      </div>
      <template #trigger>
        <el-button
          class="upload-trigger"
          ref="triggerRef"
        >
          xxx
        </el-button>
      </template>
    </el-upload>
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"
  import type { UploadRawFile, UploadInstance } from "element-plus"
  import { Plus } from "@element-plus/icons-vue"
  import "vue-cropper/dist/index.css"
  import { VueCropper } from "vue-cropper"

  import message from "@/utils/message"
  import { t } from "@/locale"

  type TCropperOptions = {
    img?: string //裁剪图片的地址
    outputSize?: number //裁剪生成图片的质量(可选0.1 - 1)
    outputType?: "jpeg" | "png" | "webp" //裁剪生成图片的格式（jpeg || png || webp）
    info?: boolean //图片大小信息
    canScale?: boolean //图片是否允许滚轮缩放
    autoCrop?: boolean //是否默认生成截图框
    autoCropWidth?: number //默认生成截图框宽度
    autoCropHeight?: number //默认生成截图框高度
    fixed?: boolean //是否开启截图框宽高固定比例
    fixedNumber?: [number, number] //截图框的宽高比例
    full?: boolean //false按原比例裁切图片，不失真
    fixedBox?: boolean //固定截图框大小，不允许改变
    canMove?: boolean //上传图片是否可以移动
    canMoveBox?: boolean //截图框能否拖动
    original?: boolean //上传图片按照原始比例渲染
    centerBox?: boolean //截图框是否被限制在图片里面
    high?: boolean //是否按照设备的dpr 输出等比例图片
    infoTrue?: boolean //true为展示真实输出图片宽高，false展示看到的截图框宽高
    maxImgSize?: number //限制图片最大宽度和高度
    enlarge?: number //图片根据截图框输出比例倍数
    mode?: string //图片默认渲染方式
  }
  const props = defineProps<{
    options?: TCropperOptions
    limitSize?: number
    maxWidth?: number
    maxHeight?: number
    forbidCropper?: boolean
  }>()

  const emits = defineEmits(["startUpload"])

  const imageUrl = ref("")
  const cropper = ref<typeof VueCropper>(null)
  const uploadRef = ref<UploadInstance>()
  const triggerRef = ref()
  const cropperOption = ref<TCropperOptions>({})

  const defaulCropperOpts: TCropperOptions = {
    img: "",
    outputSize: 1,
    outputType: "png",
    info: true,
    canScale: true,
    autoCrop: true,
    autoCropWidth: 100,
    autoCropHeight: 100,
    fixed: true,
    fixedNumber: [1, 1],
    full: false,
    fixedBox: true,
    canMove: false,
    canMoveBox: true,
    original: false,
    centerBox: false,
    high: true,
    infoTrue: false,
    maxImgSize: 3000,
    enlarge: 1,
    mode: "230px 150px"
  }

  watchEffect(() => {
    if (props.options) {
      cropperOption.value = { ...defaulCropperOpts, ...props.options }
    } else {
      cropperOption.value = defaulCropperOpts
    }
  })

  let fileName = ""

  const beforeUpload = (file: UploadRawFile) => {
    console.log(file)
    if (props.limitSize && props.limitSize < file.size) {
      message(t("upload.t4"), "warning")
      return false
    }
    if (props.forbidCropper) {
      emits("startUpload", file)
      return false
    }

    let reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      let data = ""
      if (!e.target?.result) {
        fileName = ""
        return
      }

      if (typeof e.target.result === "object") {
        data = window.URL.createObjectURL(new Blob([e.target.result]))
      } else {
        data = e.target.result
      }
      fileName = file.name
      // 如果传了最大尺寸信息，在上传文件尺寸在范围内的话就不需要截图操作了
      if (props.maxWidth || props.maxHeight) {
        const img = new Image()
        // const self = this
        img.onload = function () {
          // 图片原始尺寸
          console.log(`图片原始尺寸: 宽${img.width},高${img.height}`)
          let isExceedWidth = props.maxWidth && img.width > props.maxWidth
          let isExceedHeight = props.maxHeight && img.height > props.maxHeight
          if (!isExceedWidth && !isExceedHeight) {
            emits("startUpload", file)
          } else {
            // 尺寸超上限的时候出现裁剪功能
            cropperOption.value.img = data
          }
        }
        img.src = data
      } else {
        cropperOption.value.img = data
      }
    }
    //转化为base64
    reader.readAsDataURL(file)
    return false
  }

  const startUpload = () => {
    cropper.value.getCropBlob(async (data: Blob) => {
      let formData = new FormData()
      formData.append("file", data, fileName)
      emits("startUpload", formData)
    })
  }
  // 用户自定义按钮唤起上传组件
  const manualInvokeUploader = () => {
    console.log(uploadRef.value)
    console.log(triggerRef.value)
    triggerRef.value.ref.click()
  }

  defineExpose({
    manualInvokeUploader
  })
</script>

<style lang="less">
  .upload-cropper {
    .cropper-wrapper {
      .cropper-area {
        height: 200px;
        width: 300px;
      }
    }
    .avatar-uploader {
      width: 104px;
      height: 104px;
      position: relative;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.02);
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      .avatar {
        width: 100%;
        height: 100%;
      }
      .upload-trigger {
        display: none;
      }
      .preupload-tip {
        color: #333;
        .avatar-uploader-icon {
          font-size: 24px;
          color: #333;
          font-weight: 700;
        }
        span {
          margin-top: 15px;
          font-weight: 400;
          font-size: 14px;
        }
      }
      &:hover {
        border-color: @MainColor;
      }
    }
  }
</style>

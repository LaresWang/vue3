<template>
  <div>
    <codemirror
      v-model="code"
      placeholder="Code goes here..."
      :style="{ height: '400px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="ready"
      @change="change"
    />
    <!--       @focus="focus"
      @blur="blur" -->
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue"
  // import {} from "lodas"
  import { Codemirror } from "vue-codemirror"
  import { xml } from "@codemirror/lang-xml"
  // import { html } from "@codemirror/lang-html"
  // import { javascript } from "@codemirror/lang-javascript"
  import { oneDark } from "@codemirror/theme-one-dark"
  // import { EditorView as EV } from "@codemirror/view"
  import type { ViewUpdate, EditorView } from "@codemirror/view"
  import type { EditorState } from "@codemirror/state"

  // const code = ref(`console.log('Hello, world!')`)
  // const theme = ref(oneDark)
  // let myTheme = EV.theme(
  //   {
  //     // 输入的字体颜色
  //     "&": {
  //       color: "#0052D9",
  //       backgroundColor: "#FFFFFF"
  //     },
  //     ".cm-content": {
  //       caretColor: "#0052D9"
  //     },
  //     // 激活背景色
  //     ".cm-activeLine": {
  //       backgroundColor: "#FAFAFA"
  //     },
  //     // 激活序列的背景色
  //     ".cm-activeLineGutter": {
  //       backgroundColor: "#FAFAFA"
  //     },
  //     //光标的颜色
  //     "&.cm-focused .cm-cursor": {
  //       borderLeftColor: "#0052D9"
  //     },
  //     // 选中的状态
  //     "&.cm-focused .cm-selectionBackground, ::selection": {
  //       backgroundColor: "#0052D9",
  //       color: "#FFFFFF"
  //     },
  //     // 左侧侧边栏的颜色
  //     ".cm-gutters": {
  //       backgroundColor: "#FFFFFF",
  //       color: "#ddd", //侧边栏文字颜色
  //       border: "none"
  //     }
  //   },
  //   { dark: true }
  // )
  // const extensions = [javascript(), myTheme]
  // const extensions = [javascript(), oneDark]

  // const code = ref(`<div>123</div>`)
  // const extensions = [html(), oneDark]

  const code = ref(`<attr>123</attr>`)
  const extensions = [xml(), oneDark]

  // Codemirror EditorView instance ref
  const view = ref<EditorView>()

  // Status is available at all times via Codemirror EditorView
  // const getCodemirrorStates = () => {
  //   const state = view.value.state
  //   const ranges = state.selection.ranges
  //   const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
  //   const cursor = ranges[0].anchor
  //   const length = state.doc.length
  //   const lines = state.doc.lines
  //   // more state info ...
  //   // return ...
  // }

  // change: (value: string, viewUpdate: import("@codemirror/view").ViewUpdate) => boolean;
  //   update: (viewUpdate: import("@codemirror/view").ViewUpdate) => boolean;
  //   focus: (viewUpdate: import("@codemirror/view").ViewUpdate) => boolean;
  //   blur: (viewUpdate: import("@codemirror/view").ViewUpdate) => boolean;
  //   ready: (payload: {
  //       view: import("@codemirror/view").EditorView;
  //       state: import("@codemirror/state").EditorState;
  //       container: HTMLDivElement;
  //   }) => boolean;
  type TPayload = {
    view: EditorView
    state: EditorState
    container: HTMLDivElement
  }
  const ready = (payload: TPayload) => {
    view.value = payload.view
  }

  const change = (val: string, vu: ViewUpdate) => {
    console.log("change", val, vu)
  }

  // const focus = (vu: ViewUpdate) => {
  //   console.log("focus", vu)
  // }

  // const blur = (vu: ViewUpdate) => {
  //   console.log("blur", vu)
  // }
</script>
<style lang="less"></style>

<template>
    <div class="text-wrapper single-line-text-ellipsis"  ref="divEl">
        <span class="text-showed">{{ text }}</span>
        <span class="text-hided tip-text flex-start" :class="tipClass">{{ text }}</span>
        <span class="fix-triangle"></span>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
defineProps<{
    text: string
    tipClass?: string
}>()

const divEl = ref<HTMLDivElement>()

onMounted(()=>{
    if (!divEl.value) {
        return
    }
    divEl.value.onmouseenter = mouseEnter
    divEl.value.onmouseleave = mouseLeave
})

let showedEl: HTMLElement, hidedEl: HTMLElement,  triangleEl: HTMLElement

const mouseEnter = () => {
    // 因为html里 .text-showed 元素写在.text-hidded前面，所以下面查询到的列表第一个元素是.text-showed
    // 也可以通过遍历列表判断样式列表classList里是否含有对应的样式类 classList.contains
    ([showedEl, hidedEl, triangleEl] = divEl.value!.querySelectorAll<HTMLElement>(".text-hided, .text-showed, .fix-triangle"));
    
    if (!showedEl || !hidedEl) {
        return
    }
    
    if (showedEl.offsetWidth > divEl.value!.offsetWidth) {
        const position = divEl.value!.getBoundingClientRect()
        hidedEl.style.left = position.left + "px"
        hidedEl.style.top = position.bottom + 4 + "px"
        // 显示提示文本
        hidedEl.classList.add("show")

        triangleEl.style.left = position.left + position.width/2 -2 + "px"
        triangleEl.style.top = position.bottom -5 + "px"
        triangleEl.classList.add("show")
    }
    
}

const mouseLeave = () => {
    if (!hidedEl) {
        return
    }
    hidedEl.classList.remove("show")
    triangleEl.classList.remove("show")
}
</script>
<style lang="less">
.text-wrapper {
    // width: fit-content;
    // max-width: 100%;
    display: inline-block;
    position: relative;
    .tip-text {
        position: absolute;
        left: 0;
        top: 100%;
        height: 30px;
        padding: 0 5px;
        border-radius: 4px;
        font-weight: 600;
        background: var(--c-gray-3);
        &.show {
            position: fixed;
            z-index: 1000;
        }
    }
    .fix-triangle {
        width: 0;
        height: 0;
        display: none;
        border: 5px solid transparent;
        border-bottom-color: var(--c-gray-3);
        &.show {
            position: fixed;
            display: block;
            z-index: 999;
        }
    }
}
</style>

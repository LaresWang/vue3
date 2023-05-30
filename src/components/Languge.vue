<template>
  <div>
    <ElSelect
      v-model="selectedLang"
      @change="changeLang"
    >
      <ElOption
        v-for="lang in langs"
        :key="lang.value"
        :value="lang.value"
        :label="lang.label"
      ></ElOption>
    </ElSelect>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue"
  import useLanguage from "../stores/language"

  const langs = ref([
    {
      value: "zh",
      label: "中文"
    },
    {
      value: "en",
      label: "English"
    }
  ])

  const { language, setLang } = useLanguage()
  const selectedLang = ref(language)

  const changeLang = () => {
    console.log(selectedLang.value)
    setLang(selectedLang.value)
  }
</script>

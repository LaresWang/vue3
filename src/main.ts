import "./assets/css/main.css"
import "element-plus/theme-chalk/el-message.css"

import "./utils/setRootSize"
import "virtual:svg-icons-register"

import { createApp } from "vue"
import store from "./stores"
import i18n from "./locale"
import router from "./router"
import App from "./App.vue"

const app = createApp(App)

app.use(store)
app.use(i18n)
app.use(router)

app.mount("#app")

import path from "node:path"
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"


// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   },
//   envDir: "./envs"
// })
export default defineConfig((params)=>{
  console.log(params)
  console.log(111,import.meta.url)
  console.log(path.resolve(process.cwd(), "src/assets/svgs"))
  // console.log(222,import.meta.env.mode)
  // console.log(process.env)
  // 根据启动命令行参数process.env 设置特定的配置
  const app_env = process.env.NODE_ENV
  const dir = path.join(process.cwd(), "envs")
  const env = loadEnv(params.mode, dir, 'VITE_')
  let buildOpts = {}
  if (app_env && ["production", "uat"].includes(app_env)) {
    buildOpts = {
      minify: "terser",
      sourcemap: false,
      terserOptions: {
        compress: {
          // drop_console: true,
          pure_funcs: ["console.log", "console.info", "console.warn"],
          drop_debugger: true,
        }
      }
    }
  }

  return {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
        // imports: ["vue", "vue-router"]
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/svgs")],
        // symbolId: "[name]"
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    envDir: "./envs",
    define: {
      "APP_ENV": JSON.stringify(process.env.NODE_ENV)
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            // hack: `true; @import (reference) "${path.resolve('src/assets/css/theme.less')}"`,
            "@MainColor": "#625DF5",
            "@MainBgA005": "rgba(86,90,221,0.05)"
          },
          // javascriptEnabled: true,
        }
      },
    },
    server: {
      port: 8888,
      open: true,
      proxy: {
        "/api/realtime": {
          target: env.VITE_API_HOST,
          // ws: true,
          changeOrigin: true,
        },
      }
    },
    build: {
      cssCodeSplit: true,
      sourcemap: true,
      ...buildOpts,
    }
  }
  
})
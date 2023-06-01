## 升级 node 版本

sudo npm cache clean -f
sudo n 18.16.0

一开始可能报找不到 tsconfig 文件等 重新保存下即可

vue3 不支持 Vetur 插件 需要禁掉

Vetur disable workspace

安装 vscode 插件

Vue Language Features (Volar)

TypeScript Vue Plugin (Volar)

创建 script 标签自动添加 setup lang 属性，以下三种途径任选一种

- 点击 vscode 左下角设置图标，选择 Command Palette, 输入 Snippets, 选择 Snippets: Configure User Snippets, 然后选择创建全局或者项目 Snippets file，然后自定义文件名
- 或者点击顶部菜单栏 View，选择 Command Palette, 输入 Snippets, 选择 Snippets: Configure User Snippets, 然后选择创建全局或者项目 Snippets file，然后自定义文件名
- 点击顶部菜单 Code 或者 File，选择 Preference->Configure User Snippets, 然后选择创建全局或者项目 Snippets file，然后自定义文件名

创建完后会在项目根目录.vscode 文件夹下生成[name].code-snippets 文件，在里面可以进行自定义配置

```
"script setup ts": {
		"scope": "vue",
		"prefix": "script:setup:ts",
		"body": [
			"<script setup lang=\"ts\">",
			"$2",
			"</script>"
		],
	}
```

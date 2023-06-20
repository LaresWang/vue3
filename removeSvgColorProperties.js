const path = require("node:path")
const fsp = require("node:fs/promises")
// 这里配置一些需要动态改变svg颜色的图标
// 主要功能是把图标里包含的fill stroke属性删除
// 在项目更目录下运行 npm run svg 一键移除所有指定文件的颜色属性
const icons = [
  "icon_face",
  "icon_expression",
  "icon_action",
  "icon_face_a",
  "icon_set_up",
  "icon_exit",
];

const run = async ()=> {
  const svgDir = path.join(process.cwd(), "src/assets/svgs")
  // console.log(svgDir)
  icons.forEach(async (name)=>{
    const iconPath = path.join(svgDir, name+'.svg')
    console.log(iconPath)
    try {
      await fsp.stat(iconPath)
      let data = await fsp.readFile(iconPath, {encoding: "utf-8"})
      // console.log(data)
      data = data.replace(/(fill=".*?")|(stroke=".*?")/g, "");
      await fsp.writeFile(iconPath, data)
    } catch (e) {
      console.log(e)
    }
  })
}


run()

module.exports = () => {
  console.log(process.env.NODE_ENV)
// const baseWidth = isInMobile ? 375 : 1280; // 根据设计稿的宽度大小，设计稿的每个页面宽度保持一致
// const baseSize = isInMobile ? 10 : 14; // 与postcss config里的rootValue保持一致

  const rootValue = 14;
  // return {}
  return {
    plugins: {
      "postcss-pxtorem": {
        rootValue,
        propList: ["*"],
        selectorBlackList: [".el-"], // 这里要不要把element组建过滤掉根据需要吧
        minPixelValue: 5, // 5px以下就不用转了
        exclude: "node_module", // 根据需要吧
      }
    }
  }

}
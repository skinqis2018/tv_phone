module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
  outputDir: "build_phone",
  productionSourceMap: false,
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map'
  }
};

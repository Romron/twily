const path = require('path')
const mode = process.env.NODE_ENV || 'development'   // автоматическая установка режима разработки
const devMode = mode === 'development'
const target = devMode ? 'web' : 'browserslist'   // если не разработка то учитывать настройки для разных браузеров
const devtool = devMode ? 'source-map' : undefined    // карта кода  для разработки отмена карты кода в продакшине 

module.exports = {
   mode,
   target,
   devtool,
   entry: path.resolve(__dirname, 'src', 'index.js'),
   output: {
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      filename: '[name].[contenthash].js'
   }
}
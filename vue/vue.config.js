const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // proxy: 'http://localhost:4000'
    proxy: 'http://web:80'
  }
})
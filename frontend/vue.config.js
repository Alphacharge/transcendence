//vue.config.js

const { defineConfig } = require("@vue/cli-service");

const fs = require('fs')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 8080,
    https: {
      key: fs.readFileSync('/frontend/frontend.key'),
      cert: fs.readFileSync('/frontend/frontend.cert'),
    },
    proxy: {
      '^/api': {
        target: 'https://' + process.env.VUE_APP_BACKEND_IP + ':3000',
        secure: false,
        changeOrigin: true
      },
    }
  }
});

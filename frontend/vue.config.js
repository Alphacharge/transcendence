//vue.config.js

const { defineConfig } = require("@vue/cli-service");

const fs = require('fs')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    https: {
      key: fs.readFileSync('/certificates/certificate.key'),
      cert: fs.readFileSync('/certificates/certificate.cert'),
    },
    // public: 'localhost:8080', // Restrict access to localhost
    webSocketServer: false,
    }
  });

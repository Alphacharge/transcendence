import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');

const app = createApp(App).use(router).mount("#app");

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'path-to-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'path-to-cert.pem')),
};

const server = https.createServer(httpsOptions, express());
const port = 443; // Port for HTTPS

// Use the Vue.js app as a middleware for your HTTPS server
server.on('request', app);

server.listen(port, (err) => {
	if (err)
  console.log(`Server is running on port ${port}`);
});

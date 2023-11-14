const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
		proxy: {
			// rerouting to avoid cross-scripting errors
			'/api': {
				target: 'http://' + process.env.VUE_APP_BACKEND_IP + ':3000',
				secure: false,
				changeOrigin: true,
			},
		},
	},
});

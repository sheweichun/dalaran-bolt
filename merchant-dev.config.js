const path = require('path');
console.log('go here!!!');
module.exports = {
	configureWebpack: function (config) {
		// console.log(config.externals)
		// config.externals[0]['cn-next'] = 'Next'
		// config.module.rules.push({
		// 	// 忽略xxx包中的CSS文件
		// 	test: /\.wasm$/,
		// 	use: [{ loader: require.resolve('wasm-loader') }],
		// });
        return {
            resolve: {
				exportsFields: ['exports'],
			},
        }
	},
};

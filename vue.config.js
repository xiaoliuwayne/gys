// vue.config.js
module.exports = {
    publicPath:'./',
    devServer: {
		proxy: {
			'/api': {
                target: process.env.VUE_APP_BASE_API,
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        disableHostCheck: true
    },
    lintOnSave:false,
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({ // 把px单位换算成rem单位
                        rootValue: 37.5,
                        propList: ['*']
                    }),
                    require('autoprefixer')({
                        browsers: [
                            'Android >= 4.0',
                            'iOS >= 7'
                        ]
                    }),
                ]
            }
        }
    },
    configureWebpack: {
        devtool: 'source-map'
    }
}
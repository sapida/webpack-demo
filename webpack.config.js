const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    //提供mode配置选项，production || development, production模式下会压缩JS代码
    mode: 'production',  

    //入口文件配置项
    entry:{
        main:'./src/main.js'
    },

    //出口文件的配置项
    output: {
        //打包的路径
        path: path.resolve(__dirname, './dist'),
        //打包文件名称
        filename: 'static/js/[name].[hash:6].js',  //[name]表示打包名字跟入口名字一致
    },

    //配置别名和省略后缀名
    resolve: {
        extensions: ['.js', '.json', '.css','.scss']
    },
    //模块：加载 CSS,加载图片,加载字体等
    module:{
        rules:[
            //css/scss/sass loader
            {
                test: /\.(css|scss|sass)$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader','postcss-loader']
            },
            //图片 loader
            {
                test:/\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader', //是指定使用的loader和loader的配置参数
                        options: {
                            limit: 10000,    //是把小于10k的文件打成Base64的格式，写入JS
                            name: '[name]_[hash:7].[ext]', // 打包图片的名字
                            outputPath:'static/images/' // 打包后放到images路径下
                        }
                    }
                ]
            },
            //加载字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            },
            //页面中的img
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            },
            //babel-loader 转化es6
            {
                test:/\.(jsx|js)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },

    //插件：目的在于解决 loader 无法实现的其他事。
    plugins:[
        //添加css前缀
        require('autoprefixer'),
        //清除dist目录文件
        new CleanWebpackPlugin(),
        //HTML文件的创建
        new HtmlWebpackPlugin({
            minify:{                               //是对html文件进行压缩
                removeAttributeQuotes:true,         //removeAttrubuteQuotes是却掉属性的双引号。
                minifyCSS: true,                    // 压缩 HTML 中出现的 CSS 代码
                minifyJS: true,                     // 压缩 HTML 中出现的 JS 代码
            },
            hash:false,                            //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template:'./public/index.html'       //是要打包的html模版路径和文件名称。
        }),
        //分离css
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[chunkhash:8].css",
        }),
    ],

    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase: path.join(__dirname, "./dist"),
        //服务器的IP地址
        host:'localhost',
        //服务端压缩是否开启
        compress: true,
        //端口号
        port: 8000
    }
};
// 一个常见的`webpack`配置文件
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");

// const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  entry: __dirname + "/index.ts", //已多次提及的唯一入口文件
  output: {
    path: __dirname + "/dist",
    filename: "[name].[hash].js"
  },
  resolve: {
    alias: {
      "@/*": __dirname + "/*",
    },
    extensions: [".tsx", ".ts", ".js"]//解析类型
  },
  devtool: "inline-source-map", //'source-map',
  devServer: {
    contentBase: "./dist", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true,
    port: 2021,
    open: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(gif|png|jpe?g|svg|tif|glb)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
              outputPath: './assets/'
            }
          }
        ]
      }, // 下面几行才是 html-loader 的配置内容
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    // new copyWebpackPlugin([
    //   {
    //     from: __dirname + "/src/assets", //打包的静态资源目录地址
    //     to: "./assets" //打包到dist下面的public
    //   }
    // ]),
    // new TsconfigPathsPlugin({/* options: see below */ }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "DUI",
      template: "./index.html",
      filename: "index.html",
      minify: {
        collapseWhitespace: true
      },
      hash: true
    }),
    new webpack.BannerPlugin("版权所有，翻版必究"),
    // new HtmlWebpackPlugin({
    //     template: __dirname + "/index.html" //new 一个这个插件的实例，并传入相关的参数
    // }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.minimize(),
    new ExtractTextPlugin({
      filename: "style.css",
      disable: true
    }),
    // 这两行是新增的
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const laravelMixPlugin = require("laravel-mix");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || 'development'   // автоматическая установка режима разработки
const devMode = mode === 'development'
const target = devMode ? 'web' : 'browserslist'   // если не разработка то учитывать настройки для разных браузеров
const devtool = devMode ? 'source-map' : undefined    // карта кода  для разработки отмена карты кода в продакшине


module.exports = {
   mode,
   target,
   devtool,
   devServer: {
      port: 3000,    // смена порта при необходимости
      // open: true,    // открывает страницу при запуске сервера
      // hot: true,     // горячая перезагрузка браузер может не коректно работать 
      // npm run start
      static: {
         directory: path.join(__dirname, 'dist'),
      },
      proxy: {
         '/libs_p/**':
         // '/**':
         {
            // path: /./,
            // target: "http://localhost:80/twily/simpl_php/libs/module_php/parser.php",
            // http://localhost/twily/simpl_php/libs/module_php/parser.php
            // target: 'http://localhost:80/twily/simpl_php',
            target: 'http://localhost:80/',

         },
         // router: {
         //    // when request.headers.host == 'dev.localhost:3000',
         //    // override target 'http://www.example.org' to 'http://localhost:8000'
         //    'localhost:3000': 'http://localhost:80',
         // },
      },

      // devMiddleware: {
      //    publicPath: '/dist/'
      // },
   },
   entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
   output: {
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      filename: '[name].[contenthash].js',
      assetModuleFilename: 'assets/[name][ext]'
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: path.resolve(__dirname, 'src', 'index.php'),
      }),
      new MiniCssExtractPlugin({
         filename: '[name].[contenthash].css'
      }),
      new CopyPlugin(      // этот синтаксис устаревший поддерживает плагин до версии 5.1.1
         [
            { from: path.resolve(__dirname, 'src', 'libs/module_php/'), to: 'libs/module_php/' },
            { from: path.resolve(__dirname, 'src', 'data/'), to: 'data/' },
         ]
      )




      // new laravelMixPlugin({
      //    template: path.resolve(__dirname, 'src', 'index.php'),
      // })

   ],
   module: {
      rules: [
         {
            test: /\.(php|html)$/i,
            loader: "html-loader",
         },
         {
            test: /\.(c|sa|sc)ss$/i,
            use: [
               devMode ? "style-loader" : MiniCssExtractPlugin.loader,
               "css-loader",
               {
                  loader: 'postcss-loader',
                  options: {
                     postcssOptions: {
                        plugins: [require('postcss-preset-env')]
                     }
                  }
               },
               'sass-loader'
            ],
         },
         {
            test: /\.m?js$/i,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env']
               }
            }
         },
         {
            test: /(\.woff2?|\.ttf)$/i,      // добавить регулярки для других типов шрифтов
            type: 'asset/resource',
            generator: {
               filename: 'fonts/[name][ext]'
            }
         },
         {
            test: /\.(jpe?g|png|webp|gif|svg)$/i,
            use: [
               {
                  loader: 'image-webpack-loader',
                  options: {
                     mozjpeg: {
                        progressive: true,
                     },
                     // optipng.enabled: false will disable optipng
                     optipng: {
                        enabled: false,
                     },
                     pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                     },
                     gifsicle: {
                        interlaced: false,
                     },
                     // the webp option will enable WEBP
                     webp: {
                        quality: 75
                     }
                  }
               }
            ],
            type: 'asset/resource',
         }
      ],
   },

}



const mix = require('laravel-mix');

const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

require('laravel-mix-webp');
require('laravel-mix-polyfill');

mix
    // Обрабатываем JS
    .js(
        'resources/assets/js/index.js',
        'public/assets/js'
    )
    // Используем полифиллы
    .polyfill({
        enabled: true,
        useBuiltIns: "usage",
        targets: false, // Используем настройки browserslist из package.json
        debug: true,
        corejs: '3.8',
    })
    // Преобразовываем SASS в CSS
    .sass(
        'resources/assets/sass/main.scss', // Путь относительно каталога с webpack.mix.js
        'public/assets/css/' // Путь относительно каталога с webpack.mix.js
    )
    // Переопределяем параметры mix
    .options({
        processCssUrls: false, // Отключаем автоматическое обновление URL в CSS
        postCss: [
            // Добавляем вендорные префиксы в CSS
            require('autoprefixer')({
                cascade: false, // Отключаем выравнивание вендорных префиксов
            }),
            // Группируем стили по медиа-запросам
            require('postcss-sort-media-queries'),
        ],
    })
    // Настраиваем webpack для обработки изображений
    .webpackConfig({
        plugins: [
            // Создаем svg-спрайт с иконками
            new SVGSpritemapPlugin(
                'resources/assets/images/icons/*.svg', // Путь относительно каталога с webpack.mix.js
                {
                    output: {
                        filename: 'assets/images/icons.svg', // Путь относительно каталога public/
                        svg4everybody: false, // Отключаем плагин "SVG for Everybody"
                        svg: {
                            sizes: false // Удаляем инлайновые размеры svg
                        },
                        chunk: {
                            keep: true, // Включаем, чтобы при сборке не было ошибок из-за отсутствия spritemap.js
                        },
                        svgo: {
                            plugins: [
                                {
                                    'removeStyleElement': false // Удаляем из svg теги <style>
                                },
                                {
                                    'removeAttrs': {
                                        attrs: ["fill", "stroke"] // Удаляем часть атрибутов для управления стилями из CSS
                                    }
                                },
                            ]
                        },
                    },
                    sprite: {
                        prefix: 'icon-', // Префикс для id иконок в спрайте, будет иметь вид 'icon-имя_файла_с_иконкой'
                        generate: {
                            title: false, // Не добавляем в спрайт теги <title>
                        },
                    },
                }
            ),
            // Копируем картинки из каталога ресурсов в публичный каталог
            new CopyWebpackPlugin(
                [
                    { from: 'resources/assets/images', to: 'assets/images' },
                    // { from: path.resolve(__dirname, 'src', 'data/'), to: 'data/' },
                    // globOptions: {
                    // ignore: ["**/icons/**"], // Игнорируем каталог с иконками
                    // },
                ]
            ),
            // Оптимизируем качество изображений
            new ImageminPlugin({
                test: /\.(jpe?g|png|gif)$/i,
                plugins: [
                    imageminMozjpeg({
                        quality: 80,
                        progressive: true,
                    }),
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(php|html)$/i,
                    loader: "html-loader",
                },
                // {
                //     test: /\.(c|sa|sc)ss$/i,
                //     use: [
                //         devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                //         "css-loader",
                //         {
                //             loader: 'postcss-loader',
                //             options: {
                //                 postcssOptions: {
                //                     plugins: [require('postcss-preset-env')]
                //                 }
                //             }
                //         },
                //         'sass-loader'
                //     ],
                // },
                // {
                //     test: /\.m?js$/i,
                //     exclude: /(node_modules|bower_components)/,
                //     use: {
                //         loader: 'babel-loader',
                //         options: {
                //             presets: ['@babel/preset-env']
                //         }
                //     }
                // },
                // {
                //     test: /(\.woff2?|\.ttf)$/i,      // добавить регулярки для других типов шрифтов
                //     type: 'asset/resource',
                //     generator: {
                //         filename: 'fonts/[name][ext]'
                //     }
                // },
                // {
                //     test: /\.(jpe?g|png|webp|gif|svg)$/i,
                //     use: [
                //         {
                //             loader: 'image-webpack-loader',
                //             options: {
                //                 mozjpeg: {
                //                     progressive: true,
                //                 },
                //                 // optipng.enabled: false will disable optipng
                //                 optipng: {
                //                     enabled: false,
                //                 },
                //                 pngquant: {
                //                     quality: [0.65, 0.90],
                //                     speed: 4
                //                 },
                //                 gifsicle: {
                //                     interlaced: false,
                //                 },
                //                 // the webp option will enable WEBP
                //                 webp: {
                //                     quality: 75
                //                 }
                //             }
                //         }
                //     ],
                //     type: 'asset/resource',
                // }
            ],
        },
    })
    // Создаем WEBP версии картинок
    .ImageWebp({
        from: 'resources/assets/images', // Путь относительно каталога с webpack.mix.js
        to: 'public/assets/images', // Путь относительно каталога с webpack.mix.js
        imageminWebpOptions: {
            quality: 70
        }
    })
    // Включаем версионность
    .version();
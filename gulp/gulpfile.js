const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');


const phpFiles = [
   './src/**/*.php',
   '!./src/parts/*.*',     // т.к. fileinclude ...
]

const cssFiles = [      // для того чтобы файлы подключались в строго установленой последовательности
   './src/styles/normalize.css',
   './src/styles/style.css',
]

const jsFile = [     // для того чтобы файлы подключались в строго установленой последовательности
   './src/scripts/script.js',
]

const imgFiles = [     // для того чтобы файлы подключались в строго установленой последовательности
   './src/img/**/*.*',
]

const fontFiles = [     // для того чтобы файлы подключались в строго установленой последовательности
   './src/fonts/**/*.*',
]

function php() {
   return gulp.src(phpFiles)
      .pipe(fileinclude())
      .pipe(webpHTML())    // атоматически добавляет тег <picture> на месте обычного <img> 
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream());
}

function styles() {
   return gulp.src(cssFiles)
      .pipe(concat('main.css'))
      .pipe(autoprefixer({
         cascade: false
      }))
      .pipe(cleanCSS({ level: 2 }))    // финальная оптимизация CSS 
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream());
}

function script() {
   return gulp.src(jsFile)
      .pipe(fileinclude())    // подключает так же как и HTML @@include('filename.js')
      .pipe(uglify({ toplevel: true }))
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream());
}

function images() {
   return gulp.src(imgFiles)
      .pipe(webp({
         quality: 70
      }))
      .pipe(gulp.dest('./build/img/'))
      .pipe(gulp.src(imgFiles))
      .pipe(imagemin({
         progressive: true,
         svgoPlugins: [{ removeVieBox: false }],
         interlased: true,
         optimizationLevel: 3 // 0 of 7
      }))
      .pipe(gulp.dest('./build/img/'))
      .pipe(browserSync.stream());
}

function fonts() {
   gulp.src(fontFiles)
      .pipe(ttf2woff())
      .pipe(gulp.dest('./build/fonts/'))
   return gulp.src(fontFiles)
      .pipe(ttf2woff2())
      .pipe(gulp.dest('./build/fonts/'))
}

function watch() {
   browserSync.init({
      // baseDir: "./",
      proxy: "http://web/twily/gulp/build/",
      open: false,
   });

   gulp.watch('./src/styles/**/*.css', styles);
   gulp.watch('./src/scripts/**/*.js', script);
   gulp.watch('./src/**/*.php', php);
}

function clean_build() {
   return del(['build/*'])
}

gulp.task('php', php);
gulp.task('styles', styles);
gulp.task('script', script);
gulp.task('watch', watch);
gulp.task('clean_build', clean_build);
gulp.task('otf2ttf', function () {
   return gulp.src('./src/fonts/**/*.otf')
      .pipe(fonter({
         formats: ['ttf']
      }))
      .pipe(gulp.dest('./src/fonts/'))    // (!!)
}
);

gulp.task('build',
   gulp.series(clean_build,
      gulp.parallel(styles, script, php, images, fonts), watch
   )
);




// gulp.task('svgSprite', function () {      требует доработки и тестирования
//    return gulp.src(['./src/iconsprite/*.svg'])
//       .pipe(svgSprite({
//          mode: {
//             stack: {
//                sprite: "../icons/icons.svg"  // место вывода готового файла икон
//                // example: true,    // создаёт html файл с примерами иконок
//             }
//          }
//       }))
//       .pipe(dest('./build/img/'))
// })



const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
// const { src } = require('vinyl-fs');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');



const cssFiles = [      // для того чтобы файлы подключались в строго установленой последовательности
   './src/styles/normalize.css',
   './src/styles/style.css',
]

const jsFile = [     // для того чтобы файлы подключались в строго установленой последовательности
   './src/scripts/script.js',
]


function php() {
   return gulp.src([
      './src/**/*.php',
      '!./src/parts/*.*',     // т.к. fileinclude ...
   ])
      .pipe(fileinclude())
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
      .pipe(uglify({ toplevel: true }))
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream());
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
   // gulp.watch('./src/*.html', script);
}

function clean_build() {
   return del(['build/*'])
}


gulp.task('php', php);
gulp.task('styles', styles);
gulp.task('script', script);
gulp.task('watch', watch);
gulp.task('clean_build', clean_build);

gulp.task('build',
   gulp.series(clean_build,
      gulp.parallel(styles, script, php,), watch
   )
);

// 载入常用的插件
var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    coffee = require('gulp-coffee'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    jade = require("gulp-jade"),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    merge = require('merge-stream'),
    gutil = require('gulp-util'),
    del = require('del');


// 编译LESS文件，同时压缩之
gulp.task('styles', function () {
    return gulp.src('app/**/**/*.css')
    // .pipe(sourcemaps.init())
    // .pipe(less({}))
    // .pipe(sourcemaps.write())
    // .pipe(autoprefixer("> 1%", "last 2 version"))
    .pipe(gulp.dest('dist'))
    .pipe(rename({suffix: '.min'}))
    // .pipe(minifycss())
    .pipe(gulp.dest('dist'));
});    


// 编译coffee文件
gulp.task('coffee', function() {
  return gulp.src('app/**/**/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: false}).on('error', gutil.log))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

// 将systemjs相关文件搬运到lib目录下
gulp.task('systemjs',function(){
    var es6_loader = gulp.src('bower_components/es6-module-loader/dist/es6-module-loader.js*(.map)')
        .pipe(gulp.dest('app/lib/systemjs'));

    var traceur = gulp.src('bower_components/traceur/traceur.js')
    .pipe(gulp.dest('app/lib/systemjs'));

    var systemjs = gulp.src('bower_components/system.js/dist/system.js*(.map)')
    .pipe(gulp.dest('app/lib/systemjs'));

     return merge(es6_loader, traceur,systemjs);   
});

// 暂时不考虑合并文件，因为是按模块加载的
// 最好的方式是通过服务器端combo
gulp.task('scripts', ['coffee'],function() {

    // 自己使用的文件需要jshint
    return gulp.src('app/script/**/**/*.js')
                // .pipe(jshint('.jshintrc'))
                // .pipe(jshint.reporter(stylish))
                .pipe(gulp.dest('dist/script'))
                .pipe(rename({suffix: '.min'}))
                .pipe(uglify())
                .pipe(gulp.dest('dist/script'));
});

// 压缩图像文件
gulp.task('images', function() {
  return gulp.src('app/image/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/image'));
});

// 编译jade文件
gulp.task("jade",function(){
    return gulp.src("app/**/*.jade")
        .pipe(jade({"pretty":true}))
        .pipe(gulp.dest("dist"));
});

// 搬运文件
// 这里使用systemjs依赖
gulp.task("html",['systemjs','jade'],function(){
    // 搬运html文件
    var html = gulp.src('app/*.html')
                .pipe(gulp.dest('dist'));

    // 搬运第三方库文件
    var lib = gulp.src('app/lib/**/*.js')
                .pipe(uglify())
                .pipe(gulp.dest('dist/lib'));

    return merge(html,lib);  
});


// 清理之前的文件
gulp.task('clean', function(cb) {
    del(['dist'], cb);
});


// 默认任务
gulp.task('default', ['clean'], function() {
    gulp.start('styles','systemjs','scripts', 'images','html');
});


// 监视任务，配置LiveReload服务器
gulp.task('watch', function() {

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['app/**']).on('change', livereload.changed);

});


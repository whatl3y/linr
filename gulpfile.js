const gulp = require('gulp')
const plumber = require('gulp-plumber')
const insert = require('gulp-insert')
const uglify = require('gulp-uglify-es').default
const webpack = require('webpack-stream')
const webpackConfig = require('./webpack.config.js')

gulp.task('src', function() {
  return gulp.src("./src/**/*.js")
    .pipe(plumber())
    .pipe(webpack(webpackConfig))
    .pipe(uglify().on('error', console.log))
    .pipe(gulp.dest("./bin"))
})

gulp.task('index', function() {
  return gulp.src("./bin/*")
    .pipe(insert.prepend("#!/usr/bin/env node\n\n"))
    .pipe(gulp.dest("./bin"))
})

gulp.task('build', gulp.series('src', 'index'))

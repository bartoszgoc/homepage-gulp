"use strict";

import gulp from "gulp";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import browserSync from "browser-sync";
import sass from "gulp-sass";
import autoprefixer from "autoprefixer";
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import webpackStream from 'webpack-stream';

sass.compiler = require("node-sass");

const errorHandler = (err) => {
    notify.onError({
      title: `Gulp error in ${err.plugin}`,
      message: err.toString()
    })(err);
}

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task("assets", function() {
  return gulp.src("./src/assets/**/*").pipe(gulp.dest("./dist/assets/"));
});

gulp.task("html", function() {
  return gulp
    .src("./src/content/**/*.html")
    .pipe(
      plumber(errorHandler)
    )
    .pipe(gulp.dest("./dist/"));
});

gulp.task("js", function() {
  return gulp
    .src("src/js/main.js")
    .pipe(
      plumber(errorHandler)
    )
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(uglify())
    .on('error', errorHandler)
    .pipe(gulp.dest("dist/js"));
});

gulp.task("sass", () => {
  return gulp
    .src("./src/scss/main.scss")
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: `Gulp error in ${err.plugin}`,
            message: err.toString()
          })(err);
        }
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(
      postcss([
        autoprefixer({ grid: true, browsers: ["> 5%", "last 4 versions"] })
      ])
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

gulp.task(
  "serve",
  gulp.series("sass", "html", "js", "assets", "images", function() {
    browserSync.init({
      server: "./dist",
      open: true // set to false to disable browser autostart
    });
    gulp.watch("src/images/**", gulp.series("images"));
    gulp.watch("src/scss/**/*", gulp.series("sass"));
    gulp.watch("src/content/**/*.html", gulp.series("html"));
    gulp.watch("src/js/*.js", gulp.series("js"));
    gulp.watch("src/assets/**/*", gulp.series("assets"));
    gulp.watch("dist/**/*").on("change", browserSync.reload);
  })
);

gulp.task("build", gulp.series("sass", "html", "js", "assets"));
gulp.task("default", gulp.series("serve"));


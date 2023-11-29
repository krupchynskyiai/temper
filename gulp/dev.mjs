import gulp from "gulp";
import fileInclude from "gulp-file-include";
import { default as gulpSass } from "gulp-sass";
import * as sass from "sass";
import sassGlob from "gulp-sass-glob"; //to make possible import *.scss fiels from destination
import { default as server } from "gulp-server-livereload";
import { default as clean } from "gulp-clean"; // clean build folder
import fs from "fs"; //for files control / delete etc
import { default as sourceMap } from "gulp-sourcemaps"; //to see in dev panel the path to original scss file with styles
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import webp from "gulp-webp";
import webpack from "webpack-stream";
import webpackConfig from "../webpack.config.dev.js";
import { default as changed, compareContents } from "gulp-changed";

const scss = gulpSass(sass);

const { task, src, dest, watch, parallel, series } = gulp;

const getPlumberNotifySettings = (title) => ({
  errorHandler: notify.onError({
    title,
    message: "Error <%= error.message %>",
    sound: false,
  }),
});

/**
 * For deleting build
 */
task("clean:dev", (done) => {
  if (!fs.existsSync("./build/")) return done();
  return src("./build/", { read: false }).pipe(clean({ force: true }));
});

/**
 * For icluding html partials
 */
task("html:dev", (done) => {
  return src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(plumber(getPlumberNotifySettings("HTML")))
    .pipe(changed("build", { hasChanged: compareContents }))
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("./build/"));
});

/**
 * For scss compile
 */
task("sass:dev", (done) => {
  return src("./src/scss/*.scss")
    .pipe(sassGlob())
    .pipe(plumber(getPlumberNotifySettings("SCSS")))
    .pipe(sourceMap.init())
    .pipe(scss())
    .pipe(sourceMap.write())
    .pipe(dest("./build/css"));
});

/**
 * To copy images from src to build
 */
task("images:dev", (done) => {
  return src("./src/img/**/*")
    .pipe(changed("./build/img/"))
    .pipe(webp())
    .pipe(dest("./build/img/"))
    .pipe(src("./src/img/**/*"))
    .pipe(changed("./build/img/"))
    .pipe(dest("./build/img/"));
});

/**
 * To copy fonts from src to build
 */
task("fonts:dev", (done) => {
  return src("./src/fonts/**/*")
    .pipe(changed("./build/fonts/"))
    .pipe(dest("./build/fonts/"));
});

/**
 * To copy files from src to build
 */
task("files:dev", (done) => {
  return src("./src/files/**/*")
    .pipe(changed("./build/files/"))
    .pipe(dest("./build/files/"));
});

task("js:dev", (done) => {
  return (
    src("./src/js/*.js")
      .pipe(changed("./build/js"))
      .pipe(plumber(getPlumberNotifySettings("JS")))
      // .pipe(babel())
      .pipe(webpack(webpackConfig))
      .pipe(dest("./build/js"))
  );
});

/**
 * Live server To copy images from src to build
 */
task("server:dev", (done) => {
  return src("./build").pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

/**
 * Watching for changes in written directories and run relevant tasks on change
 */
task("watch:dev", (done) => {
  watch("./src/scss/**/*.scss", parallel("sass:dev"));
  watch("./src/html/**/*.html", parallel("html:dev"));
  watch("./src/img/**/*", parallel("images:dev"));
  watch("./src/fonts/**/*", parallel("fonts:dev"));
  watch("./src/files/**/*", parallel("files:dev"));
  watch("./src/js/**/*", parallel("js:dev"));
});

import gulp from "gulp";
import fileInclude from "gulp-file-include";

import { default as gulpSass } from "gulp-sass";
import * as sass from "sass";
import sassGlob from "gulp-sass-glob"; //to make possible import *.scss fiels from destination
import autoprefixer from "gulp-autoprefixer";
import { default as csso } from "gulp-csso";
import { default as htmlclean } from "gulp-htmlclean";
import { default as groupMedia } from "gulp-group-css-media-queries"; //to delete doubling media queries in css, used in dev mode bacuse get conflicted with sourceMapping

import { default as server } from "gulp-server-livereload";
import fs from "fs"; //for files control / delete etc
import { default as clean } from "gulp-clean"; // clean docs folder

import plumber from "gulp-plumber";
import notify from "gulp-notify";

import webpack from "webpack-stream";
import webpackConfig from "../webpack.config.prod.js";
import babel from "gulp-babel";

import changed from "gulp-changed";
import changedInPlace from "gulp-changed-in-place";

import imagemin, { gifsicle, mozjpeg, optipng, svgo } from "gulp-imagemin";
import webp from "gulp-webp";
import gulpHtmlImgWrapper from "gulp-html-img-wrapper";

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
 * For deleting docs
 */
task("clean:docs", (done) => {
  if (!fs.existsSync("./docs/")) return done();
  return src("./docs/", { read: false }).pipe(clean({ force: true }));
});

/**
 * For icluding html partials
 */
task("html:docs", (done) => {
  return src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(plumber(getPlumberNotifySettings("HTML")))
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    /* .pipe(
      gulpHtmlImgWrapper({
        logger: true, // false for not showing message with amount of wrapped img tags for each file
        extensions: [".jpg", ".png", ".jpeg"], // write your own extensions pack (case insensitive)
      })
    ) */
    .pipe(
      changedInPlace({
        firstPass: true,
      })
    )
    .pipe(htmlclean())
    .pipe(dest("./docs/"));
});

/**
 * For scss compile
 */
task("sass:docs", (done) => {
  return src("./src/scss/*.scss")
    .pipe(sassGlob())
    .pipe(plumber(getPlumberNotifySettings("SCSS")))
    .pipe(autoprefixer())
    .pipe(groupMedia())
    .pipe(scss())
    .pipe(csso())
    .pipe(dest("./docs/css"));
});

/**
 * To copy images from src to docs
 */
task("images:docs", (done) => {
  return (
    src("./src/img/**/*")
      .pipe(changed("./docs/img/"))
      .pipe(webp())
      .pipe(dest("./docs/img/"))
      .pipe(src("./src/img/**/*"))
      .pipe(changed("./docs/img/"))
      /* .pipe(
      imagemin({
        verbose: true,
      })
    ) */
      .pipe(dest("./docs/img/"))
  );
});

/**
 * To copy fonts from src to docs
 */
task("fonts:docs", (done) => {
  return src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts/"))
    .pipe(dest("./docs/fonts/"));
});

/**
 * To copy files from src to docs
 */
task("files:docs", (done) => {
  return src("./src/files/**/*")
    .pipe(changed("./docs/files/"))
    .pipe(dest("./docs/files/"));
});

task("js:docs", (done) => {
  return src("./src/js/*.js")
    .pipe(changed("./docs/js"))
    .pipe(plumber(getPlumberNotifySettings("JS")))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(dest("./docs/js"));
});

/**
 * Live server
 */
task("server:docs", (done) => {
  return src("./docs").pipe(
    server({
      open: true,
    })
  );
});

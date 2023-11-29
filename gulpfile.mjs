import gulp from "gulp";
import "./gulp/dev.mjs";
import "./gulp/docs.mjs";

const { task, src, dest, watch, parallel, series } = gulp;

/**
 * DEV
 */
task(
  "default",
  series(
    "clean:dev",
    parallel(
      "html:dev",
      "sass:dev",
      "images:dev",
      "fonts:dev",
      "files:dev",
      "js:dev"
    ),
    parallel("server:dev", "watch:dev")
  )
);

/**
 * PROD
 */
task(
  "docs",
  series(
    "clean:docs",
    parallel(
      "html:docs",
      "sass:docs",
      "images:docs",
      "fonts:docs",
      "files:docs",
      "js:docs"
    )
  )
);

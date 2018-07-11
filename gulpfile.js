"use strict";

// Module dependencies
const fs = require("fs");
const del = require("del");
const gulp = require("gulp");
const path = require("path");
const git = require("gulp-git");
const rollup = require("rollup");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const rollupCommonJS = require("rollup-plugin-commonjs");
const rollupNodeResolve = require("rollup-plugin-node-resolve");
const rollupNodeGlobals = require("rollup-plugin-node-globals");
const rollupNodeBuiltins = require("rollup-plugin-node-builtins");

// Package version for release
const PACKAGE_VERSION = require("./package.json").version;
const COMMIT_MESSAGE = `Update cloudless-dependencies to v${PACKAGE_VERSION}`; 

// Bundling input settings
const INPUT_FILE = "index.js";

// Bundling output settings
const OUTPUT_PATH = "lib";
const OUTPUT_FORMAT = "es";
const OUTPUT_FILE = "cloudless-dependencies.esm.js";
const OUTPUT_MIN_FILE = "cloudless-dependencies.esm.min.js";

// Settings for uglify mangling
const UGLIFY_OPTIONS = {
    warnings: false,
    ecma: 8,
    ie8: false,
    toplevel: true,
    mangle: {
        reserved:["YMap"],
    },
    compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
        warnings: false,
        drop_debugger: true,
        unsafe: false
    }
};

// Settings for rollup plugin node-resolve
const ROLLUP_NODE_RESOLVE_OPTIONS = {
    module: true,
    jsnext: true,
    main: true,
    browser: true,
    extensions: [".js"],
    preferBuiltins: true,
    modulesOnly: false,
    jail: "/"
};

// Settings for rollup plugin commonjs
const ROLLUP_COMMON_JS_OPTIONS = {
    include: "node_modules/**",
    exclude: [],
    extensions: [".js"],
    ignoreGlobal: false,
    sourceMap: false
};

gulp.task("clean", execFinished => {
    // Check output directory
    if (!fs.existsSync(OUTPUT_PATH)) {
        // Create folder
        fs.mkdirSync(OUTPUT_PATH, (err) => {
            if (err) console.error("Error while creating folder %s: %s", OUTPUT_PATH, err.message);
            else console.log("Created %s directory.", OUTPUT_PATH);
        });
    } else {
        // Clear output path
        del(path.join(OUTPUT_PATH, "**", "*"));
    }
    // Tell gulp the task is done
    execFinished();
});

gulp.task("rollup", () => {
    return rollup.rollup({
        input: `./${INPUT_FILE}`,
        plugins: [
            rollupNodeResolve(ROLLUP_NODE_RESOLVE_OPTIONS),
            rollupCommonJS(ROLLUP_COMMON_JS_OPTIONS),
            rollupNodeBuiltins(),
            rollupNodeGlobals()
        ]
    }).then(bundle => {
        return bundle.write({
            file: `${OUTPUT_PATH}/${OUTPUT_FILE}`,
            format: OUTPUT_FORMAT,
            exports: "named",
            sourcemap: false
        });
    });
});

gulp.task("uglify", () => {
    return gulp.src(`${OUTPUT_PATH}/${OUTPUT_FILE}`)
        .pipe(uglify(UGLIFY_OPTIONS))
        .pipe(rename(OUTPUT_MIN_FILE))
        .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task("git", () => {
    return gulp.src(['./lib/**', './index.*', './package*'])
        .pipe(git.add())
        .pipe(git.commit([COMMIT_MESSAGE]))
        .pipe(git.tag(PACKAGE_VERSION, (err) => {
            if(!err) git.push('origin', 'master', { args: " --tags" })
            else console.error(err);
        }))
});

gulp.task("default", gulp.series("clean", "rollup", "uglify", "git"));
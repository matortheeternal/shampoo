'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var wait = require('gulp-wait');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var utils = require('./utils');

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');

gulp.task('bundle', function () {
    return Promise.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js'))
    ]);
});

gulp.task('sass', function () {
    return gulp.src(srcDir.path('stylesheets/*'))
        .pipe(plumber())
        .pipe(wait(250))
        .pipe(sass())
        .pipe(gulp.dest(destDir.path('stylesheets')));
});

gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', function () {
    var beepOnError = function (done) {
        return function (err) {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };

    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('src/**/*.scss', batch(function (events, done) {
        gulp.start('sass', beepOnError(done));
    }));
});

gulp.task('build', ['bundle', 'sass', 'environment']);

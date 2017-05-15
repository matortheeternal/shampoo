'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var wait = require('gulp-wait');
var livereload = require('gulp-livereload');
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
    return Promise.all([
        gulp.src(srcDir.path('stylesheets/*.scss'))
            .pipe(plumber())
            .pipe(wait(250))
            .pipe(sass())
            .pipe(gulp.dest(destDir.path('stylesheets')))
            .pipe(livereload()),
        
        // Theme sass files have to be outputted somewhere other than the `app` folder, else they'll be
        // compiled into the `app.asar` file which makes them harder to install/modify by the user.
        gulp.src(srcDir.path('stylesheets/themes/*.scss'))
            .pipe(plumber())
            .pipe(wait(250))
            .pipe(sass())
            .pipe(gulp.dest('./themes')) // For now, and for testing purposes we'll dump it in the regular stylesheet folder too
            .pipe(gulp.dest(destDir.path('stylesheets')))
            .pipe(livereload())
    ]);
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

    livereload.listen();

    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('src/**/*.scss', batch(function (events, done) {
        gulp.start('sass', beepOnError(done));
    }));
});

gulp.task('build', ['bundle', 'sass', 'environment']);

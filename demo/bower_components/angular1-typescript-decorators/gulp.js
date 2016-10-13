"use strict";

var gulp = require("gulp"),
    clean = require("gulp-clean"),
    uglify = require('gulp-uglify'),
    typescript = require('gulp-typescript');
    
gulp.task('uglify', function(){
    gulp.src('./src/*.ts')
        .pipe(typescript(typescript.createProject('./tsconfig.json'))
        
})
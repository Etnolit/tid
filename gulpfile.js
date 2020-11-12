const { src, dest, series, parallel, watch: gulp_watch} = require('gulp');
const ts = require('gulp-typescript');
const jest = require('gulp-jest').default;
const sass_ = require('gulp-sass');
const del = require('del');
const zip = require('gulp-zip');
// const jest = require('jest-cli')


var tsProject = ts.createProject('tsconfig.json');


function test() {
    process.env.NODE_ENV = 'test';

    return src('src').pipe(jest({
        "preprocessorIgnorePatterns": [
            "<rootDir>/dist/", "<rootDir>/node_modules/"
        ], "automock": false
    }));
}


function clean() {
    return del([
            'build/**', 
            '!build/.gitkeep', 
            'dist/**', 
            '!dist/.gitkeep',
        ], {force:true});
}


function watch() {
    return gulp_watch(['src/'], series(clean, parallel(build, transpile, sass, copyIcons)));
}


function transpile() {
    return src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(dest('build'));
}


function build() {
    return src([
            'src/manifest.json',
            'src/**/*.html',
        ])
        .pipe(dest('build'));
}


function copyIcons() {
    return src([
        'src/icons/**',
    ])
    .pipe(dest('build/icons'));
}


function packageFirefox() {
    return src([
            'build/**',
            '!build/.gitkeep',
        ])
        .pipe(zip('tid-firefox.zip'))
        .pipe(dest('dist'));
}


function packageChrome() {
    return src([
            'build/**',
            '!build/.gitkeep',
        ])
        .pipe(zip('tid-chrome.zip'))
        .pipe(dest('dist'));
}


function sass() {
    return src('src/**/*.scss')
        .pipe(sass_.sync().on('error', sass_.logError))
        .pipe(dest('build/css'));
}



exports.default = series(clean, parallel(build, transpile, sass, copyIcons));
exports.build = series(clean, parallel(build, transpile, sass, copyIcons), parallel(packageFirefox, packageChrome));
exports.test = test;
exports.clean = clean;
exports.transpile = transpile;
exports.sass = sass;
exports.watch = watch;

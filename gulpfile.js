const { src, dest, task, series, watch } = require("gulp");
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');


sass.compiler = require('node-sass');


task('clean', () => {
    return src('dist/**/', {read: false})
        .pipe(clean());
});


task ('copy:img',  () => {
    return src('src/img/*.*').pipe(dest('dist/img'))
});

task ('copy:html',  () => {
    return src('src/index.html').pipe(dest('dist')).pipe(reload({stream: true}));
});


const styles = [
    'node_modules/normalize.css/normalize.css',
    'src/styles/main.scss'
];


task ('styles',  () => {
    return src(styles)
    .pipe(sourcemaps.init())
    .pipe(concat('main.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css'))
    .pipe(reload({ stream: true }));
});


task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });
});


watch("./src/styles/**/*.scss", series("styles"));
watch("./src/*.html", series("copy:html"));
task ("default", series ("clean", "styles", "copy:html","copy:img", "server"));
// Project settings
var devDirectory = 'public/',
    jsName    = 'project',                 // Project JS file name. If it is not the same with CSS file name, change it
    url       = 'localhost:5000/';       // Project virtualhost url

// Modules
var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    uglify       = require('gulp-uglify'),
    cssmin       = require('gulp-cssmin'),
    concat       = require('gulp-concat'),
    rename       = require('gulp-rename'),
    notify       = require('gulp-notify'),
    browserSync  = require('browser-sync');
    var config = {
    bowerDir: devDirectory + 'components/',
    publicDir: devDirectory,
    };

// Vendors
var vendors = {

    jquery: devDirectory + 'components/jquery/dist/jquery.min.js',
    styles: [
       devDirectory + 'components/owl.carousel/dist/assets/owl.carousel.css',
     ],
    scripts: [
       devDirectory + 'components/owl.carousel/dist/owl.carousel.js',
    ],

};

// Copy jQuery to js folder
gulp.task('copyJquery', function(){
    gulp.src(vendors.jquery)
        .pipe(gulp.dest(devDirectory + 'js'))
});


// Concatenate and minify vendor CSS
gulp.task('contactStyles', function() {
    return gulp.src(vendors.styles)
        .pipe(sourcemaps.init())
            .pipe(concat('vendor.min.css'))
            .pipe(cssmin())
        .pipe(gulp.dest(devDirectory + 'css/'));
});

// Concatenate and minify vendor JS
gulp.task('concatScripts', function() {
    return gulp.src(vendors.scripts)
        .pipe(sourcemaps.init())
            .pipe(concat('vendor.min.js'))
            .pipe(uglify())
        .pipe(gulp.dest(devDirectory + 'js/'));

});

// Sass task
gulp.task('sass', function(){
    gulp.src([devDirectory + 'stylesheets/*.scss'])
    .pipe(sourcemaps.init())
        .pipe(sass({ 'outputStyle': 'compressed' }))
        // .pipe(sass({ 'outputStyle': 'nested' }))
        // .pipe(sass({ 'outputStyle': 'expanded' }))
        // .pipe(sass({ 'outputStyle': 'compact' }))
        .on('error', notify.onError({
            message: "<%= error.message %>",
            title: 'Error in SCSS'
        }))
    // CSS Map
    // .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: 'css'}))     // Comment this line if it is not necessary
    .pipe(gulp.dest(devDirectory + 'css/'))
});

// Minify project.js
gulp.task('compressProjectJs', function() {
    gulp.src([devDirectory + 'js/' + jsName + '.js'])
    .pipe(uglify())
    .on('error', notify.onError({
        message: "<%= error.message %>",
        title: "Error in JS"
    }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(devDirectory + 'js/'))
});

// css prefixer
gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src(config.publicDir +'/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.publicDir + '/css'));
});

// BrowserSync task
gulp.task('browserSync', function() {
    browserSync.init([devDirectory + 'css/*.css', devDirectory + 'js/*.js'], {
        // virtualhost url
        proxy: url,
        ui: {
            port: 5000
        },
        browser: "google chrome"
    });
});

// Collect vendor files
gulp.task('vendor', ['copyJquery', 'contactStyles', 'concatScripts']);

// Listen for changes
gulp.task('watch', ['sass', 'browserSync', 'compressProjectJs'], function() {

    // watch scss > project scss files to css
    gulp.watch([
        devDirectory + 'stylesheets/*.scss',
        devDirectory + 'stylesheets/base/*.scss',
        devDirectory + 'stylesheets/components/*.scss',
        devDirectory + 'stylesheets/components/loader/*.scss',
        devDirectory + 'stylesheets/helpers/*.scss',
        devDirectory + 'stylesheets/layouts/*.scss',
        devDirectory + 'stylesheets/pages/*.scss',
        devDirectory + 'stylesheets/units/*.scss',
        devDirectory + 'stylesheets/variables/*.scss',
        devDirectory + 'stylesheets/_bootstrap/_custom.sccs',
    ], ['sass']);

    // watch js > project js minify
    gulp.watch([devDirectory + 'js/' + jsName + '.js', '!' +'js/' + jsName + '.min.js'], ['compressProjectJs']);

    // watch browser-sync > reload
    gulp.watch(['*.ejs', '**/*.ejs', '*.js']).on('change', browserSync.reload);

});


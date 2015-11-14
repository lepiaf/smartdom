var gulp = require('gulp');
var concat = require('gulp-concat');

var root = "front/";
var destinationDir = "public/dist";

var js = [
    // js libs
    root+"libs/angular/angular.min.js",
    root+"libs/angular-route/angular-route.min.js",
    root+"libs/Chart.js/Chart.min.js",
    root+"libs/angular-chart.js/dist/angular-chart.min.js",
    root+"libs/moment/min/moment.min.js",
    // app
    root+"js/app.js",
    root+"js/appRoutes.js",
    root+"js/**/*.js"
];

var css = [
    root+"libs/bootstrap/dist/css/bootstrap.min.css",
    root+"libs/angular-chart.js/dist/angular-chart.min.css",
    root+"css/style.css"
];

gulp.task('build', function() {
    gulp.src(js)
        .pipe(concat("app.js"))
        .pipe(gulp.dest(destinationDir));

    gulp.src(css)
        .pipe(concat("style.css"))
        .pipe(gulp.dest(destinationDir));
});
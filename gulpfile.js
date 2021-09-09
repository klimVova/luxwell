let gulpfile = require('gulp');
let pug = require('gulp-pug');
let sass = require('gulp-sass');
let postcss = require('gulp-postcss');
let rollup = require('rollup');
let resolve = require('rollup-plugin-node-resolve');
// let babel = require('rollup-plugin-babel');
const babel = require('gulp-babel');
const concat = require('gulp-concat')
var browserSync = require('browser-sync').create();

gulpfile.task('build:pug', () => {
    return gulpfile.src('src/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulpfile.dest('build'));
});

gulpfile.task('build:scss', () => {
    return gulpfile.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss())
        .pipe(gulpfile.dest('build/css'));
});

gulpfile.task('build:js', function () {
    return gulpfile.src([
      // BABEL_POLYFILL,
      'src/js/**/*.js'
    ])
      .pipe(babel({
        presets: ['@babel/preset-env'],
      }))
      .pipe(concat('main.min.js'))
      .pipe(gulpfile.dest('build/js'))
  });

// gulpfile.task('build:js', () => {
//     return rollup.rollup({
//         input: 'src/js/main.js',
//         plugins: [
//             resolve(),
//             babel({
//                 exclude: 'node_modules/**'
//             }),
//         ],
//     }).then(bundle => {
//         return bundle.write({
//             file: 'build/js/main.js',
//             format: 'iife'
//         });
//     });
// });

gulpfile.task('build:images', () => {
    return gulpfile.src('src/images/**/*', {
        allowEmpty: true
    })
        .pipe(gulpfile.dest('build/images'));
});

gulpfile.task('build:resources', () => {
    return gulpfile.src('src/resources/**/*', {
        dot: true,
        allowEmpty: true
    })
        .pipe(gulpfile.dest('build'))
});

gulpfile.task('build', gulpfile.parallel(
    'build:pug',
    'build:scss',
    'build:js',
    'build:images',
    'build:resources'
));

gulpfile.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: 'build'
        }
    });
});

gulpfile.task('watch', () => {
    gulpfile.watch('src/pug/**/*.pug', gulpfile.series('build:pug'));
    gulpfile.watch('src/scss/**/*.scss', gulpfile.series('build:scss'));
    gulpfile.watch('src/js/**/*.js', gulpfile.series('build:js'));
    gulpfile.watch('src/images/**/*', gulpfile.series('build:images'));
    gulpfile.watch(['src/resources/**/*', 'src/resources/**/.*'], gulpfile.series('build:resources'));
    gulpfile.watch('build/**/*').on('change', browserSync.reload);
});

gulpfile.task('default', gulpfile.series(
    'build',
    gulpfile.parallel(
        'serve',
        'watch'
    )
));
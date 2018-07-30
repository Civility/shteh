var gulp = require("gulp"),
csso = require("gulp-csso"),
plumber = require("gulp-plumber"), //отслеживание ошибок
sass = require("gulp-sass"), //scss in css
cssnano = require("gulp-cssnano"), // сжатие css фаилов
autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
imagemin = require('gulp-imagemin'), // предварительное сжатие картинок
tinypng = require('gulp-tinypng-compress'), // лучшие сжатие картинок
concat = require("gulp-concat"),// Объединение файлов - конкатенация
uglify = require("gulp-uglify"), // модуль для минимизации JavaScript
bowersync = require('browser-sync'), // сервер для работы и автоматического обновления страниц
rename = require("gulp-rename"),  // переименование фаилов
pug = require('gulp-pug'), // html
pugPHPFilter = require('pug-php-filter'); //  pug в php

/* настройки сервера */
var config = {
	server: {
		baseDir: 'dist'
	},
	reloadOnRestart: true,
	notify: false,
	open:false
};
//запуск сервера http://localhost:3000
gulp.task('bowersync', function () {
	bowersync(config);
});
/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
	dist: {
		html: 	'dist/',
			js: 	'dist/js/',
			css: 	'dist/css/',
			img: 	'dist/img/',
			fonts:'dist/fonts/'
	},
	src: {
		pug: 		'src/pug/*.pug',
		js: 		['bower_components/jquery/dist/jquery.js','bower_components/bootstrap/dist/js/bootstrap.min.js'],
		script: 	'src/js/script.js',
		scss: 	['src/scss/*.*',/* 'bower_components/font-awesome/web-fonts-with-css/scss/fontawesome.scss'*/ ],
		img: 		'src/img/**/*.*',
		fonts: 	'src/fonts/**/*.*'
	},
	watch: {
		pug:  'src/pug/**/*.pug',
		js:    'src/js/**/*.js',
		css:   'src/scss/**/*.scss',
		img:   'src/img/**/*.*',
	fonts: 'srs/fonts/**/*.*'
},
	clean:     'dist'
};
// Копирование файлов HTML в папку dist
gulp.task("fonts", function() {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.dist.fonts));
});

// Объединение, компиляция Sass в CSS, простановка венд. префиксов и дальнейшая минимизация кода
gulp.task("styles", function() {
	 gulp.src(path.src.scss) //путь
		.pipe(plumber()) // ошибки
		.pipe(concat('main.css')) // объединение
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		})) //автопрефиксы
			.pipe(csso({
				 restructure: false, //минимизация по умолчанию true
			}))
			.pipe(cssnano()) //минимизация, удаление лишнего, обхединение
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) //scss in css
			.pipe(rename({ suffix: '.min' })) // добавление .min
			.pipe(gulp.dest(path.dist.css)) // сохранение
			.pipe(bowersync.reload({stream: true})); //слежка
});
// Объединение и сжатие JS-файлов
gulp.task("js", function() {
	return gulp.src(path.src.js) // директория откуда брать исходники
	.pipe(plumber())
	.pipe(concat('main.js')) // объеденим все js-файлы в один 
	.pipe(uglify()) // сжатие кода
	.pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
	.pipe(gulp.dest(path.dist.js)) // директория продакшена, т.е. куда сложить готовый файл
	.pipe(bowersync.reload({stream: true})); // перезагрузим сервер
});
gulp.task("scripts", function() {
	return gulp.src(path.src.script) // директория откуда брать исходники
	.pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
	.pipe(gulp.dest(path.dist.js)) // директория продакшена, т.е. куда сложить готовый файл
	.pipe(bowersync.reload({stream: true})); // перезагрузим сервер
});
// Сжимаем картинки
gulp.task('img', function() {
	return gulp.src(path.src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true
			}))
			.pipe(gulp.dest(path.dist.img));
});
// Сжимаем картинки tinypng
gulp.task('compress', function () {
	gulp.src('src/images/*.{png,jpg,jpeg}')
		.pipe(tinypng({
			key: '_FOIEC4yG2VDU1qTngyLZJkK8cuj_Ag2',
			sigFile: 'dist/img/.min',
			log: true
		}))
	.pipe(gulp.dest(path.dist.img));
});
// pug
gulp.task('pug', function buildHTML(){
	return gulp.src(path.src.pug)
		.pipe(plumber())
		//можно использовать php
		.pipe(pug({
			//filters:{php: pugPHPFilter},
			pretty: true
		}))
		//получение php
   	// .pipe(rename(function (path) {
    //   	path.extname = ".php"
    // 	}))
		.pipe(gulp.dest(path.dist.html))
		.pipe(bowersync.reload({stream: true}));
});
// удаление каталога dist 
// var del = require('del');
// gulp.task('clean', function () {
// 	del(clean);
// })
// Задача слежения за измененными файлами
gulp.task("watch", function () {
	gulp.watch(path.watch.pug, ["pug"]);
	gulp.watch(path.watch.js, ["js"]);
	gulp.watch(path.watch.css, ["styles"]);
	gulp.watch(path.watch.fonts, ["fonts"]);
	gulp.watch(path.watch.img, ["img"]);
	gulp.watch(path.watch.img, ["scripts"]);
});
// Запуск тасков по умолчанию
gulp.task("default", ["pug" ,"styles", "fonts", "js", "scripts", "img", "watch", 'bowersync']);
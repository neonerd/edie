gulp = require "gulp"

# -- DIRECTORIES

DIR_SRC = __dirname + '/../src'
DIR_DIST = __dirname + '/../dist'

# -- GULP MODULES

coffee = require "gulp-coffee"

# -- GULP TASKS

gulp.task 'build', () ->

	gulp.src DIR_SRC + '/**/*.coffee'
	.pipe coffee()
	.pipe gulp.dest(DIR_DIST)

# -- DEFAULT TASK

gulp.task 'default', ['build']
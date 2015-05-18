# dependencies

scanner =

	dir : require "./scanner/recursiveDir"
	controllers : require "./scanner/controllers"

processor =

	controller : require "./processor/controller"

injector =

	schema : require "./injector/schema"

# default configuration values
defaultConfig = 

	# root path for routes
	root : '/'
	# separator distinguishing names and variables in URL
	parameterSeparator : '_'

# main function
edie = (app, config) ->

	# -- config validation
	throw Error("Missing controllers directory!") unless config.controllersDir?

	# -- default configuration for properties not provided
	config.root = defaultConfig.root unless config.root?
	config.parameterSeparator = defaultConfig.parameterSeparator unless config.parameterSeparator?

	# -- scan the controllers directory structure
	dirStructure = scanner.dir(config.controllersDir)
	# -- extract all controller definitions
	controllers = scanner.controllers(dirStructure)

	# -- create schemas mapping functions to methods
	for controller in controllers

		schema = processor.controller(controller)

		# -- injection
		# -- NOT FUNCTIONAL ;(((
		injector.schema controller.relativePath, schema, app, config.parameterSeparator

module.exports = edie
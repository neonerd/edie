# dependencies

scanner =

	dir : require "./scanner/dir"
	controller : require "./scanner/controller"

# default configuration values
defaultConfig = 

	# root path for routes
	root : '/'
	# separator distinguishing names and variables in URL
	parameterSeparator : '_'

# main function
edie = (app, config) ->

	throw Error("Missing controllers directory!") unless config.controllersDir?

module.exports = edie
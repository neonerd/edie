

module.exports = (relativePath, schema, app, parameterSeparator) ->

	# -- replace the relativePath parameters
	relativePath = relativePath.replace parameterSeparator, ':'

	for method, middleware of schema
		console.log relativePath
		if(middleware.length > 0)
			app[method].call app, relativePath, middleware
method = require "./method"

module.exports = (controllerDefinition) ->

	schema =
		all : []
		get : []
		post : []
		put : []
		'delete' : []

	# -- plugins
	for pluginDefinition in controllerDefinition.plugins

		plugin = require pluginDefinition.path
		plugin.methods = ['all'] unless plugin.methods?

		if(plugin.middleware?)
			for m in plugin.methods
				schema[m] = schema[m].concat plugin.middleware

	# -- controller itself
	controller = require controllerDefinition.path
	if(controller.get?) then schema.get = schema.get.concat(method(controller.get))
	if(controller.post?) then schema.post = schema.post.concat(method(controller.post))
	if(controller.put?) then schema.put = schema.put.concat(method(controller.put))
	if(controller.delete?) then schema.delete = schema.delete.concat(method(controller.delete))

	return schema
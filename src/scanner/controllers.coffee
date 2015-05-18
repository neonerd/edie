fs = require "fs"

scanControllers = (dirStructure, plugins=[]) ->

	controllers = []
	currentPlugins = dirStructure.plugins.concat(plugins)

	for name, dir of dirStructure.dirs

		controllers = controllers.concat scanControllers(dir, currentPlugins)

	for controller in dirStructure.controllers

		controller.plugins = currentPlugins
		controller.relativePath = dirStructure.relativePath

		if(controller.name != 'index')
			controller.relativePath += '/' + controller.name

		controllers.push controller

	return controllers

module.exports = scanControllers
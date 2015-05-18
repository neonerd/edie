fs = require "fs"

module.exports = (dirPath, separator="/", pluginSeparator="_") ->

	contents = fs.readdirSync(dirPath)

	dirs = []
	controllers = []
	plugins = []

	for path in contents

		stats = fs.statSync( dirPath + separator + path )

		if(stats.isDirectory())
			dirs.push {
				name : path
				path : dirPath + separator + path
			}

		else
			if(path[0] == pluginSeparator)
				name = path.substr(1).split('.')
				name.pop()
				plugins.push {
					name : name.join('.')
					path : dirPath + separator + path
				}

			else
				name = path.split('.')
				name.pop()
				controllers.push {
					name : name.join('.')
					path : dirPath + separator + path
				}

	return {

		path : dirPath

		dirs : dirs
		controllers : controllers
		plugins : plugins

	}
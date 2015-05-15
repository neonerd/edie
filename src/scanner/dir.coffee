fs = require "fs"

module.exports = (dirPath, separator="/", pluginSeparator="_") ->

	contents = fs.readdirSync(dirPath)

	dirs = []
	controllers = []
	plugins = []

	for path in contents

		stats = fs.statsSync( dirPath + separator + path )

		if(stats.isDirectory())
			dirs.push {
				name : path
				path : dirPath + separator + path
			}

		else
			if(path[0] == pluginSeparator)
				plugins.push {
					name : path.substr(1)
					path : dirPath + separator + path
				}

			else
				controllers.push {
					name : path
					path : dirPath + separator + path
				}

	return {

		dirs : dirs
		controllers : controllers
		plugins : plugins

	}
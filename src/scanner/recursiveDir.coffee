scan = require "./dir"

recursiveDir = (directory, relativePath="") ->

	result = scan(directory)
	children = {}

	for dir in result.dirs
		children[dir.name] = recursiveDir(dir.path, relativePath + '/' + dir.name)

	result.dirs = children

	if(relativePath != '')
		result.relativePath = relativePath
	else
		result.relativePath = '/'
		
	return result

module.exports = recursiveDir
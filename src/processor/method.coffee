module.exports = (method) ->

	f = []

	if(method.middleware?)
		f = f.concat method.middleware

	f.push method.dispatch

	return f
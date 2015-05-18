module.exports =

	middleware : [

		(req, res, next) ->

			req.movie = {id : 1}
			next()

	]
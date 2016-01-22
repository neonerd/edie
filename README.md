Edie
====

Edie is a convention-over-configuration Express controllers layer.

It allows developers to rapidly create functional REST APIs / web applications.

Conventions are primarily based around the {json:api} standard.

Installation
====

```
npm install edie --save
```

Quickstart
====

Edie gets initialized by calling its root function with an Express app and configuration object as a parameters.

```javascript
var edie = require('edie');
var app = require('express')();

edie(app, {controllersDir : __dirname + '/controllers'});
app.listen(300);

console.log('Server is up, listening at 3000');
```

How does it work?
====

Edie scans the provided controllers directory and creates Express routes based on its contents. Each subdirectory serves as an additional routing level, i.e. /controllers/movies/index.js will be available as /movies in the application.

You can use _parameter in the directory name to define named parameters, i.e. /controllers/movies/_id/index.coffee will be available as /movies/:id in your application.

Controller file
====

Controller file should export an object with these properties:

dispatch : (req, res) - main dispatch function, call at the end of request cycle
middleware : [ (req, res, next) ] - middleware specific for this controller

Plugin file
====

Files named with "_" at the beginning act as plugins, i.e. they propagate their properties into all other controllers in their path. A plugin file should export an object with these properties:

middleware : [ (req, res, next) ] - middleware to be inserted at the beginning of every other controller in this directory / its children

Configuration options
====

These options can be passed to the edie(app, config) functions:

controllersDir - REQUIRED, absolute path to the directory containing the controller structure
root - OPTIONAL, root path that prepends all routes (passing "/api" will result in all routes starting with "/api"), defaults to "/"
parameterSeparator - OPTIONAL, a special character that indicates a named parameter in the route, defaults to "_"


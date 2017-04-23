/**
* Edie 3.0
* Andrej Sykora <as@andrejsykora.com>
* Easy convention-over-configuration Koa routing
* See examples/basic.js for basic usage
* See GitHub repository for full documentation
**/

const DEFAULTS = {
// scope is separated for files
  BEHAVIOUR_NAME_SEPARATOR: '.',
  // if a directory begins with this, it's treated as :name in the route
  PARAMETER_ROUTE_PREFIX: /_/g,
  // root behaviour name
  ROOT_FILE: 'index'
}

// node.js core dependencies
const path = require('path')
const fs = require('fs')

// external dependencies
const koaRouter = require('koa-router')

// sub-functions
function processBehaviourFile (filePath, fileName) {
  // determine the http method to use
  const fileNameTokens = fileName.split(DEFAULTS.BEHAVIOUR_NAME_SEPARATOR)
  const name = fileNameTokens[0]
  let methodType = 'get'
  if (fileNameTokens.length > 2) {
    methodType = fileNameTokens[1]
  }

  // fetch the middleware and plugins to use
  let middleware = []
  let plugins = []

  let behaviourExport = require(filePath)
  if (behaviourExport.default !== undefined) {
    behaviourExport = behaviourExport.default
  }

  if (typeof behaviourExport === 'function') {
    middleware.push(behaviourExport)
  } else {
    middleware = middleware.concat(behaviourExport.middleware)
    plugins = plugins.concat(behaviourExport.plugins)
  }

  return {
    middleware,
    plugins,
    method: methodType,
    filePath,
    directoryPath: path.dirname(filePath),
    routeName: name
  }
}

function processPluginFile (filePath, fileName) {
  // determine the http method to use
  const fileNameTokens = fileName.split(DEFAULTS.BEHAVIOUR_NAME_SEPARATOR)
  const name = fileNameTokens[0]

  // fetch the middleware and plugins to use
  let middleware = []
  let plugins = []

  let pluginExport = require(filePath)
  if (pluginExport.default !== undefined) {
    pluginExport = pluginExport.default
  }

  if (typeof pluginExport === 'function') {
    middleware.push(pluginExport)
  } else {
    middleware = middleware.concat(pluginExport.middleware)
  }

  return {
    middleware,
    name
  }
}

function getBehaviours (directory) {
  let behaviours = []

  const directoryContents = fs.readdirSync(directory)

  // Either recursively scan the next directory, or process the file and add it to the result array
  directoryContents.map(fileName => {
    const filePath = path.join(directory, fileName)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      behaviours.push.apply(behaviours, getBehaviours(filePath))
    } else {
      behaviours.push(processBehaviourFile(filePath, fileName))
    }
  })

  return behaviours
}

function getPlugins (directory) {
  let plugins = []

  const directoryContents = fs.readdirSync(directory)

  // Either recursively scan the next directory, or process the file and add it to the result array
  directoryContents.map(fileName => {
    const filePath = path.join(directory, fileName)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      plugins.push.apply(plugins, getPlugins(filePath))
    } else {
      plugins.push(processPluginFile(filePath, fileName))
    }
  })

  return plugins
}

function generatePluginsMap (plugins) {
  const pluginsMap = {}

  plugins.map(plugin => {
    if (pluginsMap[plugin.name] !== undefined) {
      throw new Error('Edie: It seems you have two plugins with same name. This is not supported.')
    }

    pluginsMap[plugin.name] = plugin
  })

  return pluginsMap
}

/**
 * 
 * !Mutates the router instance.
 */
function applyBehavioursToRouter (behaviours, plugins, router, rootDirectory) {

  const pluginsMap = generatePluginsMap(plugins)

  behaviours.map(behaviour => {
    const routePathParts = []

    routePathParts.push(path.relative(rootDirectory, behaviour.directoryPath)
    .replace(new RegExp('\\' + path.sep, 'g'), '/')
    .replace(DEFAULTS.PARAMETER_ROUTE_PREFIX, ':'))

    if (behaviour.routeName !== 'index') {
      routePathParts.push(behaviour.routeName)
    }

    const routePath = '/' + routePathParts.join('/')
    const middlewareToInject = []

    // Apply plugins if any
    behaviour.plugins.map(pluginName => {
      if (pluginsMap[pluginName] === undefined) {
        throw new Error('Edie: Behaviour ' + routePath + ' is requesting a plugin that does not exist.')
      }

      Array.prototype.push.apply(middlewareToInject, pluginsMap[pluginName].middleware)
    })

    // Apply main behaviour middleware
    Array.prototype.push.apply(middlewareToInject, behaviour.middleware)

    // Attach the route path last
    middlewareToInject.unshift(routePath)

    router[behaviour.method].apply(router, middlewareToInject)
  })

}

// main function
function edie (behavioursDirectory, pluginsDirectory) {

  const router = new koaRouter()
  const behaviours = getBehaviours(behavioursDirectory)
  const plugins = pluginsDirectory ? getPlugins(pluginsDirectory) : []

  applyBehavioursToRouter(behaviours, plugins, router, behavioursDirectory)

  return router

}

// export
module.exports = edie


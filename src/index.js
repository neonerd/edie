const DEFAULTS = {
  // if a single behaviour begins with one of these prefixes, it's either propagated on the current level or on every level below
  // if the prefix is followed by anything else, it becomes a "tagged" behaviour only injected into other behaviours if specifically requested
  NESTED_BEHAVIOUR_PREFIX: '__',
  SINGLE_LEVEL_BEHAVIOUR_PREFIX: '_',
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

/**
 * [behaviourStructure description]
 * @param  {[type]} fileName      [description]
 * @param  {[type]} directoryPath [description]
 * @return {[type]}               [description]
 */
const behaviourStructure = function (fileName, previousDirectories, rootDirectory) {

  const fileNameTokens = fileName.split(DEFAULTS.BEHAVIOUR_NAME_SEPARATOR)
  const name = fileNameTokens[0]
  // determine the http method to use
  let methodType = 'get'
  if (fileNameTokens.length > 2) {
    methodType = fileNameTokens[1]
  }

  // determine the type to use
  const nestedRegex = new RegExp('^' + DEFAULTS.NESTED_BEHAVIOUR_PREFIX)
  const singleRegex = new RegExp('^' + DEFAULTS.SINGLE_LEVEL_BEHAVIOUR_PREFIX)

  let type = 'normal'
  let tag = ''
  const singleResult = name.match(singleRegex)
  if (singleResult !== null) {
    type = 'single'
    tag = name.replace(singleRegex, '')
  }
  const nestedResult = name.match(nestedRegex)
  if (nestedResult !== null) {
    type = 'nested'
    tag = name.replace(nestedRegex, '')
  }

  // determine the raw route path
  let rawRouteTokens = []
  if (name !== DEFAULTS.ROOT_FILE) {
    rawRouteTokens = previousDirectories.concat([fileNameTokens[0]])
  } else {
    rawRouteTokens = previousDirectories
  }
  const rawRoute = '/' + rawRouteTokens.join('/')

  // fetch the middleware and tags to use
  let middleware = []
  let tags = []

  let behaviourExport = require(path.join(rootDirectory, previousDirectories.join('/'), fileName))
  if (behaviourExport.default !== undefined) {
    behaviourExport = behaviourExport.default
  }

  if (typeof behaviourExport === 'function') {
    middleware.push(behaviourExport)
  } else {
    middleware = middleware.concat(behaviourExport.middleware)
    tags = tags.concat(behaviourExport.tags)
  }

  // return the behaviour structure
  return {
    name,
    rawRoute,
    type,
    method: methodType,
    middleware,
    tags,
    tag
  }

}

/**
 * Traverses the directory tree and 
 * @param  {[type]} startingDirectory   [description]
 * @param  {[type]} previousDirectories [description]
 * @param  {[type]} inheritedBehaviours [description]
 * @return {[type]}                     [description]
 */
const traverseDirectories = function (startingDirectory, previousDirectories, inheritedBehaviours) {

  if (previousDirectories === undefined) {
    previousDirectories = []
  }
  if (inheritedBehaviours === undefined) {
    inheritedBehaviours = []
  }

  let currentContents = []
  if (previousDirectories.length > 0) {
    currentContents = fs.readdirSync(path.join(startingDirectory, previousDirectories.join('/')))
  } else {
    currentContents = fs.readdirSync(startingDirectory)
  }
  const nextDirectories = []
  const currentBehaviours = []

  currentContents.map(fileName => {
    let filePath = ''
    if (previousDirectories.length === 0) {
      filePath = path.join(startingDirectory, fileName)
    } else {
      filePath = path.join(startingDirectory, previousDirectories.join('/'), fileName)
    }
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      nextDirectories.push(fileName)
    } else {
      currentBehaviours.push(behaviourStructure(fileName, previousDirectories, startingDirectory))
    }
  })

  const nextInheritedBehaviours = inheritedBehaviours.concat([])
  const singleLevelBehaviours = []
  let usedBehaviours = []

  currentBehaviours.map(behaviour => {
    if (behaviour.type === 'single') {
      singleLevelBehaviours.push(behaviour)
    }
    if (behaviour.type === 'nested') {
      nextInheritedBehaviours.push(behaviour)
    }
    if (behaviour.type === 'normal') {
      usedBehaviours.push(behaviour)
    }
  })

  singleLevelBehaviours.concat(nextInheritedBehaviours).map(behaviourToInject => {
    usedBehaviours.map(behaviour => {
      if (behaviourToInject.tag === '' || behaviour.tags.indexOf(behaviourToInject.tag) > -1) {
        behaviour.middleware = behaviourToInject.middleware.concat(behaviour.middleware)
      }
      return behaviour
    })
  })

  nextDirectories.map(nextDirectory => {
    usedBehaviours = usedBehaviours.concat(
        traverseDirectories(
          startingDirectory,
          previousDirectories.concat([nextDirectory]), 
          nextInheritedBehaviours
        )
      )
  })
  
  return usedBehaviours

}

/**
 * Transforms a path-route string into koaRouter route string
 * @param  {[type]} rawRoute [description]
 * @return {[type]}          [description]
 */
const transformRawRoute = function (rawRoute) {
  return rawRoute.replace(DEFAULTS.PARAMETER_ROUTE_PREFIX, ':')
}

/**
 * Inject the behaviours into the app using koa-router
 * ! Mutates the app object
 * @param  {[type]} directory [description]
 * @param  {[type]} koaApp    [description]
 * @return {[type]}           [description]
 */
const edie = function (directory, koaApp) {
  // first we need to scan the directory
  // create the behaviours array
  const behaviours = traverseDirectories(directory)
  // now we apply each behaviour and its middleware via koa-router
  const router = koaRouter()
  behaviours.map(behaviour => {
    /**
     * This monstrosity is here because the current version of koa-router does not terminate routing at the first match, so all routes matching can get executed.
     * This is NOT the preferred behaviours, if there is a /user/:id and /user/deleteAll, the latter one should take precedence
     * Therefore, we create our wrapper generator function that executes the behaviour middleware in order, without the behaviour "polluting" the koa-router next function
     */
    router[behaviour.method](transformRawRoute(behaviour.rawRoute), function * (next) {
      let stack = []

      behaviour.middleware.map((m, index) => {
        if(behaviour.middleware[index+1])
          stack.push(m.call(this, behaviour.middleware[index+1]))
        else
          stack.push(m.call(this, Promise.resolve(true)))
      })

      yield stack
    })
  })
  koaApp.use(router.routes())
  koaApp.use(router.allowedMethods())
  return koaApp
}

module.exports = edie
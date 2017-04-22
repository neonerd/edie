/**
* Edie 3.0
* Easy convention-over-configuration Koa routing
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

// main function
function edie (directory) {

}


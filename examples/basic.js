// where are the behaviours located?
const BEHAVIOURS_DIR = __dirname + '/../test/behaviours'
const PLUGINS_DIR = __dirname + '/../test/plugins'

// require edie and koa
const edie = require('../src/index2')
const koa = require('koa')

// create a koa app and listen at port 3000
const app = koa()
app.listen(3000)
console.log('App is now listening @ 3000')

// generate routes and allowed methods

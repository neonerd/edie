// where are the behaviours located?
const BEHAVIOURS_DIR = __dirname + '/../test/behaviours'

// require edie and koa
const edie = require('../src')
const koa = require('koa')

// create a koa app and listen at port 3000
const app = koa()
app.listen(3000)
console.log('App is now listening @ 3000')

// attach behaviours
edie(BEHAVIOURS_DIR, app)
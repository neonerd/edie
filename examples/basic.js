// where are the behaviours located?
const BEHAVIOURS_DIR = __dirname + '/../test/behaviours'
const PLUGINS_DIR = __dirname + '/../test/plugins'

// require edie and koa
const edie = require('../')
const koa = require('koa')

// create a koa app and listen at port 3000
const app = new koa()
app.listen(3000)
console.log('App is now listening @ 3000')

// generate routes and allowed methods
const router = edie(BEHAVIOURS_DIR, PLUGINS_DIR)

app.use(router.routes())
app.use(router.allowedMethods())
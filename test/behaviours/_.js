module.exports = function * (next) {
  this.middleware += 'single'
  yield next
}
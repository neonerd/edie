module.exports = function * (next) {
  this.middleware += 'nested'
  yield next
}
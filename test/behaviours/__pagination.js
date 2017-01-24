module.exports = function * (next) {
  this.middleware += 'pagination'
  yield next
}
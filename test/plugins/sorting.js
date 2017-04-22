module.exports = async function (ctx, next) {
  this.middleware += 'sorting'
  await next
}
module.exports = async function (ctx, next) {
  this.middleware += 'pagination'
  await next
}
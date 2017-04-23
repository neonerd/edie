module.exports = async function (ctx, next) {
  ctx.middleware += 'pagination'
  return next()
}
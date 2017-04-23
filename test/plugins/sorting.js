module.exports = async function (ctx, next) {
  ctx.middleware += 'sorting'
  return next()
}
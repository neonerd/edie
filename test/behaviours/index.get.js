module.exports = async function (ctx, next) {
  ctx.body = {
    status: 'OK',
    page: 'index'
  }
}
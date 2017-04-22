module.exports = async function (ctx, next) {
  ctx.body = {
    status: 'success',
    id: ctx.params.id
  }
}
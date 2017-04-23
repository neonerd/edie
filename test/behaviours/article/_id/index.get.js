module.exports = async function (ctx) {
  ctx.body = {
    status: 'success',
    id: ctx.params.id
  }
}
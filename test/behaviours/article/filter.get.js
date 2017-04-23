module.exports = {
  middleware: [
    async function (ctx) {
      ctx.body = {
        status: 'OK',
        page: 'articlesFilter',
        middleware: ctx.middleware
      }
    }
  ],
  plugins: ['sorting', 'pagination']
}
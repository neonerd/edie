module.exports = {
  middleware: [
    async function (ctx) {
      ctx.body = {
        status: 'OK',
        page: 'articles',
        middleware: ctx.middleware
      }
    }
  ],
  plugins: ['pagination']
} 
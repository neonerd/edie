module.exports = {
  middleware: [
    function * () {
      this.body = {
        status: 'OK',
        page: 'articles',
        middleware: this.middleware
      }
    }
  ],
  tags: ['pagination']
} 
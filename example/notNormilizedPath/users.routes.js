module.exports = {
  prefix: '/users',
  routes: [{
    path: '//:id',
    method: 'GET',
    handler: (ctx) => { ctx.body = { conter: 20 } }
  }]
}

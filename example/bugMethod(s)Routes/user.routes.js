module.exports = {
  prefix: '/users',
  middelwares: [(ctx, next) => { ctx.state = { count: 0 }; next() }],
  routes: [{
    path: '/',
    middelwares: [(ctx, next) => { ctx.state = { count: ctx.state.count + 20 }; next() }], // array of functions.
    handler: (ctx) => { ctx.body = { conter: ctx.state.count } }
  }]
}

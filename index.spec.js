const assert = require('assert')
const path = require('path')
const Boom = require('boom')
const Koa = require('koa')
const request = require('supertest')
const koaRouterLoader = require('.')

function createApp (opts) {
  const app = new Koa()
  koaRouterLoader(app, { dir: path.join(__dirname, 'example', 'routes'), ...opts })
  return app
}

describe('koa-response-handler', () => {
  it('koaRoutesLoader should be a function', () => {
    assert(typeof koaRouterLoader === 'function')
  })

  it('should throw when pass invalid option', () => {
    assert.throws(() => {
      createApp({ dir: 1000 }).listen()
    })
  })

  it('should throw when pass invalid option', () => {
    assert.throws(() => {
      createApp({ dir: path.join(__dirname, 'example', 'bugSchemaRoutes') }).listen()
    })
  })

  it('should throw when you can not find method key and methods key in the routes schema', () => {
    assert.throws(() => {
      createApp({ dir: path.join(__dirname, 'example', 'bugMethod(s)Routes') }).listen()
    })
  })

  it('should respond with correctly config.', done => {
    request(createApp().listen())
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(/{"conter":20}/)
      .expect(200, done)
  })

  it('should use the file name as middlefix when pass useFilePrefix option as true', done => {
    request(createApp({ useFilePrefix: true }).listen())
      .get('/users/user.routess')
      .expect('Content-Type', /json/)
      .expect(/{"conter":20}/)
      .expect(200, done)
  })

  it('should respond with boom and allowedMethods ', done => {
    request(createApp({
      allowedMethods: {
        methodNotAllowed: () => new Boom.methodNotAllowed()
      }
    }).listen())
      .get('/products')
      .expect(/Not Found/)
      .expect(404, done)
  })
})

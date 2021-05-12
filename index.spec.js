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

describe('koa-routes-loader', () => {
  it('should be a function', () => {
    assert(typeof koaRouterLoader === 'function')
  })

  describe('should throw when pass invalid option', () => {
    describe('type', () => {
      it('dir', () => {
        assert.throws(() => {
          createApp({ dir: 1000 }).listen()
        })
      })

      it('glob', () => {
        assert.throws(() => {
          createApp({ glob: 1000 }).listen()
        })
      })
      it('useFilePrefix', () => {
        assert.throws(() => {
          createApp({ useFilePrefix: 1000 }).listen()
        })
      })

      it('autoPlural', () => {
        assert.throws(() => {
          createApp({ autoPlural: 1000 }).listen()
        })
      })

      it('allowedMethods', () => {
        assert.throws(() => {
          createApp({ allowedMethods: 1000 }).listen()
        })
      })
    })
    describe('content', () => {
      it('dir', () => {
        assert.throws(() => {
          createApp({ dir: path.join(__dirname, 'example', 'bugMethod(s)Routes') }).listen()
        })
      })

      it('glob', () => {
        assert.throws(() => {
          createApp({ glob: { ignore: 1000 } }).listen()
        })
      })

      // don't need to test useFilePrefix/autoPlural beacause are boolean.

      it('allowedMethods', () => {
        assert.throws(() => {
          createApp({ allowedMethods: { throw: 1000 } }).listen()
        })
      })
    })
  })

  it('should throw when break the schema rules.', () => {
    assert.throws(() => {
      createApp({ dir: path.join(__dirname, 'example', 'bugSchemaRoutes') }).listen()
    })
  })

  it('should respond correctly and normalize route path.', done => {
    request(createApp({
      dir: path.join(__dirname, 'example', 'notNormilizedPath')
    }).listen())
      .get('/users/id')
      .expect('Content-Type', /json/)
      .expect(/{"conter":20}/)
      .expect(200, done)
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

  it('should not use plural when pass autoPlural option as false', done => { // autoPlural work only when useFilePrefix as true.
    request(createApp({ useFilePrefix: true, autoPlural: false }).listen())
      .get('/users/user.routes')
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

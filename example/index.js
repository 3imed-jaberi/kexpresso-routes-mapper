'use strict'

const path = require('path')
const Koa = require('koa')
const koaRouterLoader = require('..')

const app = new Koa()
koaRouterLoader(app, { dir: path.join(__dirname, 'routes') })

app.listen(3000)

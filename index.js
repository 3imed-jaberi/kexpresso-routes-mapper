/*!
 * koa-routes-loader
 *
 * Copyright(c) 2021 Imed Jaberi
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */
const KoaRouter = require('koa-router')
const Joi = require('joi')
const Glob = require('glob')

/**
 * Expose `koaRouterLoader()`.
 */

module.exports = koaRouterLoader

/**
 * Load routes automatically from file system.
 *
 * @api public
 */
function koaRouterLoader (app, options) {
  // normalize the path by remove all trailing slash.
  function normalizePath (path) {
    path = path.replace(/\/\/+/g, '/')
    if (path !== '/' && path.slice(-1) === '/') {
      path = path.slice(0, -1)
    }

    return path
  }

  // joi schemas.
  const optionsObjectSchema = Joi.object({
    dir: Joi.string().required(),
    glob: Joi.object().default({ ignore: '' }),
    useFilePrefix: Joi.boolean().default(false),
    autoPlural: Joi.boolean().default(true),
    allowedMethods: Joi.object({
      throw: Joi.boolean(),
      notImplemented: Joi.function(),
      methodNotAllowed: Joi.function()
    })
  })

  const routesObjectSchema = Joi.object({
    path: Joi.string().required(),
    method: Joi.string().optional(),
    methods: Joi.array().items(Joi.string().required()).optional(),
    middelwares: Joi.array().items(Joi.function().required()).optional(),
    handler: Joi.function().required()
  })

  const mainSchema = Joi.object({
    prefix: Joi.string().optional(),
    middelwares: Joi.array().items(Joi.function().required()).optional(),
    routes: [routesObjectSchema, Joi.array().items(routesObjectSchema).required()]
  })

  // check the options object.
  const {
    value: {
      dir,
      glob,
      useFilePrefix,
      autoPlural,
      allowedMethods
    },
    error
  } = optionsObjectSchema.validate(options)

  // throw if exist an error inside the options object.
  if (error) {
    throw new Error(error.details.message)
  }

  // read all files.
  const files = Glob.sync(`${dir}/**/*.js`, glob)

  // loop through the files list.
  for (const file of files) {
    // load the routes file.
    const routesConfigModule = require(file)

    // validate the file content is respect our rules !!
    const { value: routesConfig, error } = mainSchema.validate(routesConfigModule)

    // throw if exist an error related to file routes rules.
    if (error) {
      throw new Error(error.details.message)
    }

    // extract 1st level of config.
    const { prefix, routes, middelwares: sharedMiddelwares = [] } = routesConfig

    // create router instance.
    const router = new KoaRouter()

    // handle the middlefix.
    let moduleName = ''
    if (useFilePrefix) {
      moduleName = file.slice(file.lastIndexOf('/') + 1, -'.js'.length)
      if (autoPlural) {
        moduleName = `${moduleName}s`
      }
    }

    // load routes.
    for (let { path, method, methods, middelwares = [], handler } of routes) {
      // check method/methods.
      if (!method && !methods) {
        throw new Error('should you provide a method as string or methods as array of strings')
      }

      // compose and normalize path.
      path = normalizePath(`${prefix}/${moduleName}/${path}`)
      console.log('*******', path)
      // force to use array.
      methods = methods || [method]
      // compose all the middelwares.
      middelwares = [...sharedMiddelwares, ...middelwares]

      // register all routes.
      for (const method of methods) {
        router[method.toLowerCase()](path, ...middelwares, handler)
      }
    }

    // mount the middelwares.
    app.use(router.routes())
    if (allowedMethods) {
      app.use(router.allowedMethods(allowedMethods))
    }
  }
}

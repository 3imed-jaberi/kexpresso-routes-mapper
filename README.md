# koa-routes-loader

---

[![Build Status][travis-img]][travis-url]
[![Coverage Status][coverage-img]][coverage-url]
[![NPM version][npm-badge]][npm-url]
[![License][license-badge]][license-url]
![Code Size][code-size-badge]

<!-- ***************** -->

[travis-img]: https://travis-ci.com/3imed-jaberi/koa-routes-loader.svg?branch=master
[travis-url]: https://travis-ci.com/3imed-jaberi/koa-routes-loader
[coverage-img]: https://coveralls.io/repos/github/3imed-jaberi/koa-routes-loader/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/3imed-jaberi/koa-routes-loader?branch=master
[npm-badge]: https://img.shields.io/npm/v/koa-routes-loader.svg?style=flat
[npm-url]: https://www.npmjs.com/package/koa-routes-loader
[license-badge]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: https://github.com/3imed-jaberi/koa-routes-loader/blob/master/LICENSE
[code-size-badge]: https://img.shields.io/github/languages/code-size/3imed-jaberi/koa-routes-loader

<!-- ***************** -->

**Load routes automatically from file system for Koa applications ⚡.**

## `Features`

- 🚀 &nbsp; Amiable and elegant routes loader.
- 💅🏻 &nbsp; Glamorous and clean router style.
- 🔥 &nbsp; Use koa-router under the hood.
- 🪀 &nbsp; Support for prefix for all routes.
- 🎳 &nbsp; Support for shared middlewares between all routes.
- 🪁 &nbsp; Support for single and multi-methods on each route.
- 🎯 &nbsp; Support for specific middlewares on each route.
- ⚖️ Tiny bundle size.

## `Installation`

```bash
# npm
$ npm install koa-routes-loader
# yarn
$ yarn add koa-routes-loader
```

## `Usage`

This is a practical example of how to use.

```javascript
// routes/users.routes.js
module.exports = {
  prefix: '/users',
  middelwares: [
    (ctx, next) => {
      ctx.state = { count: 0 };
      next();
    }
  ],
  routes: [
    {
      path: '/',
      method: 'GET',
      middelwares: [
        (ctx, next) => {
          ctx.state = { count: ctx.state.count + 20 };
          next();
        }
      ],
      handler: (ctx) => {
        ctx.body = { conter: ctx.state.count };
      }
    }
  ]
};
```

```javascript
const path = require('path');
const Koa = require('koa');
const koaRouterLoader = require('koa-routes-loader');

const app = new Koa();
koaRouterLoader(app, { dir: path.join(__dirname, 'routes') });

app.listen(3000);
// /users GET 200 { coutner: 20 }
```

## `GUIDE`

#### 1. Create your routes folder (`folder_name`).

```bash
$ cd myapp      # change your directory to your application.
$ mkdir routes  # create the routes folder.
```

#### 2. Create your routes file (`file_name.js`).

```bash
$ cd routes && touch user.js
```

#### 3. Create your routes schema.

Here, should you understand each key can you use in the schema.

```js
{
  prefix: '/',            // prefix for all routes presented in this file. (string)
  middelwares: [],        // middlewares shared between all routes presented in this file. (array)
  routes: [               // routes should loaded. (array)
    {
      path: '/',          // path of the current route. (string)
                          // Note:
                          //  - should present method or methods not both.
                          //  - if exist both, we use methods.
      method: '',         // method of the current route (one only). (string)
      methods: [],        // methods of the current route (more than one). (array)
      middelwares: [],    // middlewares used only with the current route. (array)
      handler: () => {}   // handler used by the router. (function)
    }
  ]
}
```

#### 4. Load all the routes from files.

```js
// const koaRouterLoader = require('koa-routes-loader');

koaRouterLoader(
  koaApplication, // koa instance. (Koa)
  {
    dir: '', // path for your `routes_folder_name`. (string)
    glob: {}, // glob options passed directly to Glob module. (object)
    useFilePrefix: false, // boolean tell the loader to use the file
    // name inside the route path -/prefix/fileName/routePath-. (boolean)
    autoPlural: true, // boolean tell the loader to add `s` as suffix
    // to the used fileName -work only when useFilePrefix set to true-. (boolean)
    allowedMethods: null // your custom allowed methods. (object)
  }
);
```

#### License

---

[MIT](LICENSE) &copy; [Imed Jaberi](https://github.com/3imed-jaberi)

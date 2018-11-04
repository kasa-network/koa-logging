<div align="center">
  <h1>@kasa/koa-logging</h1>
</div>

<p align="center">
  A middleware that logs request and response in Koa
</p>

<div align="center">
  <a href="https://circleci.com/gh/kasa-network/koa-logging">
    <img alt="CircleCI" src="https://circleci.com/gh/kasa-network/koa-logging.svg?style=shield" />
  </a>
  <a href="https://coveralls.io/github/kasa-network/koa-logging">
    <img src="https://coveralls.io/repos/github/kasa-network/koa-logging/badge.svg" alt='Coverage Status' />
  </a>
  <a href="https://badge.fury.io/js/@kasa/koa-logging">
    <img alt="npm version" src="https://img.shields.io/npm/v/@kasa/koa-logging.svg" />
  </a>
  <a href="https://david-dm.org/kasa-network/koa-logging">
    <img alt="npm" src="https://img.shields.io/david/kasa-network/koa-logging.svg?style=flat-square" />
  </a>
  <a href="https://opensource.org/licenses/mit-license.php">
    <img alt="MIT Licence" src="https://badges.frapsoft.com/os/mit/mit.svg?v=103" />
  </a>
  <a href="https://github.com/ellerbrock/open-source-badge/">
    <img alt="Open Source Love" src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" />
  </a>
</div>

<br />


## Installation

```bash
# Using NPM
$ npm install --save @kasa/koa-logging
# Using Yarn
$ yarn add @kasa/koa-logging
```


### Dependencies

- [**Koa**](https://github.com/koajs/koa) 2.0+
- [**Node.js**](https://nodejs.org) 8.0.0+


## Usage

Use `koa-request-id` as a middleware for a [koa](https://github.com/koajs/koa) app. By default, it writes logs into `stdin` for HTTP requests, responses and errors. Every log include the request id, which logger will try to get from common places such as `ctx.reqId`, `ctx.state.reqId`, `ctx.req.id`.

In the following example, you can check the request and response logs from `stdin`:

```js
// app.js
const Koa = require('koa');
const requestId = require('@kasa/koa-request-id');
const logging = require('@kasa/koa-logging');
const pino = require('pino');
const app = new Koa();

app.use(requestId());
app.use(logging({ logger: pino() }));
app.use(async ctx => {
  ctx.body = 'Hello, logging!';
});

app.listen(3000);
```

```bash
$ node app.js || pino-pretty -c -l -t
```

```bash
$ curl -X POST http://localhost:3000/users
```

```bash
INFO [2018-11-04 09:54:00.596 +0000] (app/15600 on my-macbook): POST /users (4f83e15b-c34c-4f8c-9f57-938e54e54ae3)
    reqId: "4f83e15b-c34c-4f8c-9f57-938e54e54ae3"
    req: {
      "method": "POST",
      "path": "/users",
      "url": "/users",
      "headers": {
        "host": "localhost:3000",
        "user-agent": "curl/7.54.0",
        "accept": "*/*"
      },
      "protocol": "http",
      "ip": "127.0.0.1",
      "query": {}
    }
    event: "request"
```


## API

### Creating an middleware

You can create a new logging middleware by passing the existing pino logger and the relevant options to `logging`;

```node
const logger = pino();
const middleware = logging({
  logger,
  serializers: {},
  overrideSerializers: true,
  getReqId: (ctx) => ctx.reqId,
  getRequestLogLevel: (ctx) => 'info',
  getResponseLogLevel: (ctx) => ctx.state >= 500 ? 'error' : 'info',
  getErrorLogLevel: (err) => 'error'
});
```

### Middleware Configuration

These are the available config options for the middleware. All is optional except `logger`.

```node
{
  // Logger instance of pino
  logger: pino(),

  // Serializers to override defaults provided
  serializers: {
    req: (ctx) => ({
      ...
    }),
    user: (ctx) => ({
      ...
    })
  },

  // Ovveride serializers if true (default: true)
  overrideSerializers: true,

  // Function to get the request id from `ctx`
  getReqId: (ctx) => ctx.reqId,

  // Function to decide log level of the request from `ctx`
  getRequestLogLevel: (ctx) => 'info',

  // Function to decide log level of the response from `ctx`
  getResponseLogLevel: (ctx) => ctx.state >= 500 ? 'error' : 'info',

  // Function to decide log level of the error from `err`
  getErrorLogLevel: (err) => 'error'
}
```


## Contributing

#### Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/kasa-network/koa-logging/issues) to report any bugs or ask feature requests.


## License

Copyright © 2018, [Kasa](http://www.kasa.network).

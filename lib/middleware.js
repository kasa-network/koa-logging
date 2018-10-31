'use strict';

const debug = require('debug')('koa:logging');
const defaultSerializers = require('./serializers');
const utils = require('./utils');


/**
 * Return middleware that attachs logger to context and
 * logs HTTP request/response and error.
 *
 * @param {Object} options={} - Optional configuration.
 * @param {Object} options.logger - Logger instance of pino.
 * @param {Object} options.serializers - Serializers to override defaults provided.
 * @param {function} options.getReqId - Function to get the request id from `ctx`.
 * @param {function} options.getRequestLogLevel - Function to decide log level of the request from `ctx`.
 * @param {function} options.getResponseLogLevel - Function to decide log level of the response from `ctx`.
 * @param {function} options.getErrorLogLevel - Function to decide log level of the error from `error`.
 * @return {function} Koa middleware.
 */
module.exports = (options = {}) => {
  const {
    logger = null,
    getReqId = () => null,
    getRequestLogLevel = utils.getRequestLogLevel,
    getResponseLogLevel = utils.getResponseLogLevel,
    getErrorLogLevel = utils.getErrorLogLevel
  } = options;
  const serializers = {
    ...defaultSerializers,
    ...options.serializers
  };

  if (typeof logger !== 'object' || logger === null) {
    throw new TypeError('Logger required');
  }

  debug('Create a middleware');

  return async function logging(ctx, next) {
    // Try to get the request id
    const reqId = getReqId(ctx)
      || ctx.state.reqId
      || ctx.reqId
      || ctx.req.id
      || ctx.get('X-Request-Id');
    const startTime = new Date();
    ctx.log = logger.child({
      reqId,
      serializers
    });

    debug(`Created a child logger from parent logger (reqId=${reqId})`);

    const reqLogLevel = getRequestLogLevel(ctx);
    ctx.log[reqLogLevel](
      { req: ctx, event: 'request' },
      `${ctx.method} ${ctx.path} (${reqId})`
    );

    debug('Logged a request event');

    // Handle response logging when response is sent
    ctx.res.on('finish', () => {
      ctx.duration = new Date() - startTime;

      const resLogLevel = getResponseLogLevel(ctx);
      ctx.log[resLogLevel](
        { req: ctx, res: ctx, event: 'response' },
        `${ctx.status} ${ctx.message} - ${ctx.duration}ms (${reqId})`
      );

      debug('Logged a response event');

      // Remove log object to mitigate accidental leaks
      delete ctx.log;
    });

    try {
      await next();
    } catch (err) {
      const errLogLevel = getErrorLogLevel(ctx);
      ctx.log[errLogLevel](
        { err, event: 'error' },
        `Unhandled exception occured (${reqId})`
      );

      debug('Logged an error event');

      throw err;
    }
  };
};

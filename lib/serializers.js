'use strict';


exports.req = (ctx = {}) => {
  return {
    method: ctx.method,
    path: ctx.path,
    url: ctx.url,
    headers: ctx.headers,
    protocol: ctx.protocol,
    ip: ctx.ip,
    query: ctx.query
  };
};

exports.res = (ctx = {}) => {
  return {
    statusCode: ctx.status,
    duration: ctx.duration,
    type: ctx.type,
    headers: (ctx.response || {}).headers
  };
};

exports.err = (err) => {
  if (!(err instanceof Error)) {
    return err;
  }
  return {
    name: err.name,
    message: err.message,
    code: err.code,
    status: err.status,
    stack: err.stack
  };
};

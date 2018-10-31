'use strict';


// eslint-disable-next-line
exports.getRequestLogLevel = (ctx = {}) => {
  return 'info';
};

exports.getResponseLogLevel = (ctx = {}) => {
  const status = ctx.status;
  if (status >= 500) {
    return 'error';
  } else if (status >= 400) {
    return 'warn';
  }
  return 'info';
};

// eslint-disable-next-line
exports.getErrorLogLevel = (err) => {
  return 'error';
};

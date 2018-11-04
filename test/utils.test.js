'use strict';

const utils = require('../lib/utils');


describe('utils', () => {
  it('should have `getRequestLogLevel`, `getResponseLogLevel`, `getErrorLogLevel` functions', () => {
    expect(utils.getRequestLogLevel).toBeDefined();
    expect(utils.getResponseLogLevel).toBeDefined();
    expect(utils.getErrorLogLevel).toBeDefined();
  });

  describe('getRequestLogLevel', () => {
    const fn = utils.getRequestLogLevel;

    it('should be defined as function', () => {
      expect(fn).toBeDefined();
      expect(fn).toBeFunction();
    });

    it('should always return `info` level', () => {
      const expected = [
        [null, 'info'],
        [{}, 'info'],
        [{ req: {}, res: {} }, 'info'],
        [[], 'info']
      ];
      for (const [ctx, logLevel] of expected) {
        expect(fn(ctx)).toEqual(logLevel);
      }
    });
  });

  describe('getResponseLogLevel', () => {
    const fn = utils.getResponseLogLevel;

    it('should be defined as function', () => {
      expect(fn).toBeDefined();
      expect(fn).toBeFunction();
    });

    it('should return `info` level if status code is 1xx', () => {
      const expected = 'info';
      for (let i = 100; i < 200; i++) {
        const ctx = { status: i };
        expect(fn(ctx)).toEqual(expected);
      }
    });

    it('should return `info` level if status code is 2xx', () => {
      const expected = 'info';
      for (let i = 200; i < 300; i++) {
        const ctx = { status: i };
        expect(fn(ctx)).toEqual(expected);
      }
    });

    it('should return `info` level if status code is 3xx', () => {
      const expected = 'info';
      for (let i = 300; i < 400; i++) {
        const ctx = { status: i };
        expect(fn(ctx)).toEqual(expected);
      }
    });

    it('should return `warn` level if status code is 4xx', () => {
      const expected = 'warn';
      for (let i = 400; i < 500; i++) {
        const ctx = { status: i };
        expect(fn(ctx)).toEqual(expected);
      }
    });

    it('should return `error` level if status code is 5xx', () => {
      const expected = 'error';
      for (let i = 500; i < 600; i++) {
        const ctx = { status: i };
        expect(fn(ctx)).toEqual(expected);
      }
    });

    it('should return `info` level in other cases', () => {
      const expected = [
        [{}, 'info'],
        [{ req: {}, res: {} }, 'info'],
        [{ status: {} }, 'info'],
        [{ status: 100 }, 'info'],
        [{ status: 112 }, 'info'],
        [{ status: 10 }, 'info'],
        [{ status: 300 }, 'info'],
        [{ status: 313 }, 'info']
      ];
      for (const [ctx, logLevel] of expected) {
        expect(fn(ctx)).toEqual(logLevel);
      }
    });
  });

  describe('getErrorLogLevel', () => {
    const fn = utils.getErrorLogLevel;

    it('should be defined as function', () => {
      expect(fn).toBeDefined();
      expect(fn).toBeFunction();
    });

    it('should always return `error` level', () => {
      const expected = [
        [null, 'error'],
        [{}, 'error'],
        [{ req: {}, res: {} }, 'error'],
        [[], 'error'],
        [new Error(), 'error'],
        [new Error('hello'), 'error'],
        [new TypeError('what'), 'error']
      ];
      for (const [err, logLevel] of expected) {
        expect(fn(err)).toEqual(logLevel);
      }
    });
  });
});

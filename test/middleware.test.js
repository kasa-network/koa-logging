'use strict';

const logging = require('../');


describe('logging', () => {
  it('should be defined as function', () => {
    expect(logging).toBeDefined();
    expect(logging).toBeFunction();
  });

  describe('middleware', () => {
    let middleware;

    beforeEach(() => {
      middleware = logging();
    });

    it.skip('should be defined as koa middleware function', () => {
      expect(middleware).toBeDefined();
      expect(middleware).toBeFunction();
    });

    it.skip('should expose a named function', () => {
      expect(middleware.name).toEqual('logging');
    });
  });
});

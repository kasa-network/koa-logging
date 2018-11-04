'use strict';

const serializers = require('../lib/serializers');


describe('serializers', () => {
  it('should have `req`, `res`, `err` serializers', () => {
    expect(serializers.req).toBeDefined();
    expect(serializers.res).toBeDefined();
    expect(serializers.err).toBeDefined();
  });

  describe('reqSerializer', () => {
    const serializer = serializers.req;

    it('should be defined as function', () => {
      expect(serializer).toBeDefined();
      expect(serializer).toBeFunction();
    });
  });

  describe('resSerializer', () => {
    const serializer = serializers.res;

    it('should be defined as function', () => {
      expect(serializer).toBeDefined();
      expect(serializer).toBeFunction();
    });
  });

  describe('errSerializer', () => {
    const serializer = serializers.err;

    it('should be defined as function', () => {
      expect(serializer).toBeDefined();
      expect(serializer).toBeFunction();
    });
  });
});

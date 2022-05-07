const { extractTimeNumber } = require('../lib/util');

describe('Util', () => {
  describe('extractTimeNumber', () => {
    it('convert long to number', () => {
      expect(extractTimeNumber({ unsigned: false, high: 0, low: 1651889241 })).toEqual(1651889241);
      expect(extractTimeNumber({ unsigned: true, high: 0, low: 2351889241 })).toEqual(2351889241);
      expect(extractTimeNumber({ unsigned: false, high: -1, low: 1651889241 }))
        .toEqual(-2643078055);
      expect(extractTimeNumber({ low: 1651889278 })).toEqual(1651889278);
      expect(extractTimeNumber({ unsigned: true, high: 542, low: 2351889241 }))
        .toEqual(2330224163673);
      expect(extractTimeNumber({ unsigned: false, high: 542, low: 2351889241 }))
        .toEqual(2330224163673);
      expect(extractTimeNumber({ high: 542 }))
        .toEqual(2327872274432);
      expect(extractTimeNumber({ high: 542 }))
        .toEqual(2327872274432);
    });

    it('convert string to number', () => {
      expect(extractTimeNumber('1651889241')).toEqual(1651889241);
      expect(extractTimeNumber('0')).toEqual(0);
      expect(extractTimeNumber('-2643078055')).toEqual(-2643078055);
    });

    it('return number for number input', () => {
      expect(extractTimeNumber(1651889241)).toEqual(1651889241);
      expect(extractTimeNumber(0)).toEqual(0);
      expect(extractTimeNumber(-2643078055)).toEqual(-2643078055);
    });

    it('return null for invalid object', () => {
      expect(extractTimeNumber({})).toEqual(null);
      expect(extractTimeNumber({ unsigned: true })).toEqual(null);
      expect(extractTimeNumber({ test: 1651889241 })).toEqual(null);
      expect(extractTimeNumber(null)).toEqual(null);
      expect(extractTimeNumber(undefined)).toEqual(null);
      expect(extractTimeNumber(NaN)).toEqual(null);
    });

    it('return null for string that is not a number', () => {
      expect(extractTimeNumber('this is not a number')).toEqual(null);
    });
  });
});

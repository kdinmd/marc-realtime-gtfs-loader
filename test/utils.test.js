const { extractTimeNumber, createTimestamp, addTimestamp } = require('../lib/utils');

describe('Utils', () => {
  describe('extractTimeNumber', () => {
    it('convert long to number', () => {
      expect(extractTimeNumber({ unsigned: false, high: 0, low: 1651889241 }))
        .toEqual(1651889241);
      expect(extractTimeNumber({ unsigned: true, high: 0, low: 2351889241 }))
        .toEqual(2351889241);
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

  describe('createTimestamp', () => {
    it('creates timestamp', () => {
      // timestamp format expected to be ISO 'YYYY-MM-DDTHH:mm:ss.sss'
      // split at '.' as timestamps are not created at exactly same time
      const expectedTimestamp = new Date().toISOString();
      const newTimestamp = createTimestamp();

      expect(expectedTimestamp.split('.')[0]).toEqual(newTimestamp.split('.')[0]);
    });
  });

  describe('addTimestamp', () => {
    it('adds timestamp to objects', () => {
      const expectedTimestamp = new Date().toISOString().split('.')[0];

      const input = [
        { user: 1 },
        { user: 2 },
        { user: 3 },
      ];

      const result = addTimestamp(input, 'updated_at');

      expect(result).toHaveLength(3);

      result.forEach((item, index) => {
        expect(item.updated_at.split('.')[0]).toEqual(expectedTimestamp);
        expect(item.user).toEqual(index + 1);
      });
    });
  });
});
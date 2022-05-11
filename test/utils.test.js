const utils = require('../lib/utils');

describe('Utils', () => {
  describe('extractTimeNumber', () => {
    it('convert long to number', () => {
      expect(utils.extractTimeNumber({ unsigned: false, high: 0, low: 1651889241 }))
        .toEqual(1651889241);
      expect(utils.extractTimeNumber({ unsigned: true, high: 0, low: 2351889241 }))
        .toEqual(2351889241);
      expect(utils.extractTimeNumber({ unsigned: false, high: -1, low: 1651889241 }))
        .toEqual(-2643078055);
      expect(utils.extractTimeNumber({ low: 1651889278 })).toEqual(1651889278);
      expect(utils.extractTimeNumber({ unsigned: true, high: 542, low: 2351889241 }))
        .toEqual(2330224163673);
      expect(utils.extractTimeNumber({ unsigned: false, high: 542, low: 2351889241 }))
        .toEqual(2330224163673);
      expect(utils.extractTimeNumber({ high: 542 }))
        .toEqual(2327872274432);
      expect(utils.extractTimeNumber({ high: 542 }))
        .toEqual(2327872274432);
    });

    it('convert string to number', () => {
      expect(utils.extractTimeNumber('1651889241')).toEqual(1651889241);
      expect(utils.extractTimeNumber('0')).toEqual(0);
      expect(utils.extractTimeNumber('-2643078055')).toEqual(-2643078055);
    });

    it('return number for number input', () => {
      expect(utils.extractTimeNumber(1651889241)).toEqual(1651889241);
      expect(utils.extractTimeNumber(0)).toEqual(0);
      expect(utils.extractTimeNumber(-2643078055)).toEqual(-2643078055);
    });

    it('return null for invalid object', () => {
      expect(utils.extractTimeNumber({})).toEqual(null);
      expect(utils.extractTimeNumber({ unsigned: true })).toEqual(null);
      expect(utils.extractTimeNumber({ test: 1651889241 })).toEqual(null);
      expect(utils.extractTimeNumber(null)).toEqual(null);
      expect(utils.extractTimeNumber(undefined)).toEqual(null);
      expect(utils.extractTimeNumber(NaN)).toEqual(null);
    });

    it('return null for string that is not a number', () => {
      expect(utils.extractTimeNumber('this is not a number')).toEqual(null);
    });
  });

  describe('createTimestamp', () => {
    it('creates timestamp', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 4, 10, 12, 30, 5));

      const expectedTimestamp = new Date().toISOString();
      const newTimestamp = utils.createTimestamp();

      expect(expectedTimestamp).toEqual(newTimestamp);

      jest.useRealTimers();
    });
  });

  describe('addTimestamp', () => {
    it('adds timestamp to objects', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 4, 10, 12, 30, 5));

      const expectedTimestamp = new Date().toISOString();

      const input = [
        { user: 1 },
        { user: 2 },
        { user: 3 },
      ];

      const result = utils.addTimestamp(input, 'updated_at');

      expect(result).toHaveLength(3);

      result.forEach((item, index) => {
        expect(item.updated_at).toEqual(expectedTimestamp);
        expect(item.user).toEqual(index + 1);
      });

      jest.useRealTimers();
    });
  });

  describe('createMessageWithLocalDateString', () => {
    it('creates message with local time', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 4, 10, 12, 30, 5));

      expect(utils.createMessageWithLocalDateString('Test Message')).toEqual('5/10/2022, 12:30:05: Test Message');

      jest.useRealTimers();
    });
  });

  describe('secondsToMilliseconds', () => {
    it('should convert seconds to milliseconds', () => {
      expect(utils.secondsToMilliseconds(1)).toEqual(1000);
      expect(utils.secondsToMilliseconds(500)).toEqual(500000);
    });

    it('should return 0 if input is less than 0', () => {
      expect(utils.secondsToMilliseconds(-1)).toEqual(0);
      expect(utils.secondsToMilliseconds(-500)).toEqual(0);
    });
  });

  describe('getTimeout', () => {
    it('should calculate timeout', () => {
      const startTime = new Date();
      const finishTime = new Date();
      finishTime.setTime(finishTime.getTime() + utils.secondsToMilliseconds(8));

      expect(utils.getTimeout(startTime, finishTime, 15)).toEqual(utils.secondsToMilliseconds(7));
      expect(utils.getTimeout(startTime, finishTime, 10)).toEqual(utils.secondsToMilliseconds(2));
    });

    it('should return 0 if calculated timeout is less than 0', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 4, 10, 12, 30, 5));

      const startTime = new Date();
      const finishTime = new Date();
      finishTime.setTime(finishTime.getTime() + utils.secondsToMilliseconds(16));

      expect(utils.getTimeout(startTime, finishTime, 15)).toEqual(0);

      jest.useRealTimers();
    });

    it('should throw error if start time is after finish time', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 4, 10, 12, 30, 5));

      const startTime = new Date();
      const finishTime = new Date();
      startTime.setTime(startTime.getTime() + utils.secondsToMilliseconds(16));

      expect(() => { return utils.getTimeout(startTime, finishTime, 15); }).toThrow();

      jest.useRealTimers();
    });
  });
});

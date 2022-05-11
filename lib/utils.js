const Long = require('long');

const extractTimeNumber = (timeInput) => {
  /* eslint-disable no-prototype-builtins */
  if (timeInput && typeof timeInput === 'object' && (timeInput.hasOwnProperty('low') || timeInput.hasOwnProperty('high'))) {
    /* eslint-enable no-prototype-builtins */
    const timeLong = new Long(timeInput.low, timeInput.high, timeInput.unsigned);
    if (timeLong) {
      return timeLong.toNumber();
    }
  } else if (typeof timeInput === 'number' && !Number.isNaN(timeInput)) {
    return timeInput;
  } else if (typeof timeInput === 'string') {
    if (!Number.isNaN(timeInput) && !Number.isNaN(parseFloat(timeInput))) {
      return Number(timeInput);
    }
  }

  return null;
};

const createTimestamp = () => {
  return new Date().toISOString();
};

const addTimestamp = (data, fieldName) => {
  const timestamp = createTimestamp();

  const dataWithTimestamp = data.map((dataObject) => {
    const dataObjectWithTimestamp = { ...dataObject };
    dataObjectWithTimestamp[fieldName] = timestamp;
    return dataObjectWithTimestamp;
  });

  return dataWithTimestamp;
};

const createMessageWithLocalDateString = (message) => {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false });
  return `${currentTime}: ${message}`;
};

const secondsToMilliseconds = (seconds) => {
  if (seconds > 0) {
    return seconds * 1000;
  }

  return 0;
};

const getTimeout = (startTime, finishTime, desiredTimeoutInSeconds) => {
  if (startTime > finishTime) {
    throw new Error('getTimeout: Start time is after finish time');
  }

  const duration = finishTime - startTime;
  const timeoutRemaining = secondsToMilliseconds(desiredTimeoutInSeconds) - duration;

  if (timeoutRemaining < 0) {
    return 0;
  }

  return timeoutRemaining;
};

module.exports = {
  extractTimeNumber,
  createTimestamp,
  addTimestamp,
  createMessageWithLocalDateString,
  secondsToMilliseconds,
  getTimeout,
};

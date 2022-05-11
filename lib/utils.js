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

module.exports = { extractTimeNumber, createTimestamp, addTimestamp };

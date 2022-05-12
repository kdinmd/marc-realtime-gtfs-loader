const Ajv = require('ajv');
const timestampSchema = require('../schemas/timestamp.json');
const tripDescriptorSchema = require('../schemas/tripDescriptor.json');
const vehicleDescriptorSchema = require('../schemas/vehicleDescriptor.json');
const positionSchema = require('../schemas/position.json');
const vehiclePostitionSchema = require('../schemas/vehiclePosition.json');
const stopTimeEventSchema = require('../schemas/stopTimeEvent.json');
const stopTimeUpdateSchema = require('../schemas/stopTimeUpdate.json');
const tripUpdateSchema = require('../schemas/tripUpdate.json');

const ajv = new Ajv();
ajv.addSchema(timestampSchema);
ajv.addSchema(tripDescriptorSchema);
ajv.addSchema(vehicleDescriptorSchema);
ajv.addSchema(positionSchema);
ajv.addSchema(vehiclePostitionSchema);
ajv.addSchema(stopTimeEventSchema);
ajv.addSchema(stopTimeUpdateSchema);
ajv.addSchema(tripUpdateSchema);

const validate = (validator, data) => {
  const valid = validator(data);
  if (!valid) {
    console.error(validator.errors);
  }

  return valid;
};

const isValid = (objectName, data) => {
  const validator = ajv.getSchema(`${objectName}Schema`);
  if (!validator) {
    console.log(`Schema does not exist for ${objectName}`);
    return null;
  }

  return validate(validator, data);
};

module.exports = {
  isValid,
};

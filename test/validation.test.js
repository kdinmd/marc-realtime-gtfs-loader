const { isValid } = require('../lib/validation');

describe('Validation', () => {
  describe('isValid', () => {
    it('should return null if schema does not exist for object name', () => {
      expect(isValid('An object name that does not have a schema', {})).toBeNull();
    });

    it('should return false if schema exists but data is invalid', () => {
      expect(isValid('Position', {})).not.toBeNull();
      expect(isValid('Position', {})).toBe(false);
    });

    it('should return true if schema exists and data is valid', () => {
      const position = {
        latitude: 39.153995513916016,
        longitude: -76.6974868774414,
      };

      expect(isValid('Position', position)).not.toBeNull();
      expect(isValid('Position', position)).toBe(true);
    });

    describe('should support schema validation', () => {
      it('for Position', () => {
        try {
          expect(isValid('Position', {})).not.toBeNull();
        } catch (err) {
          console.log(err);
          throw new Error('Error during schema validation');
        }
      });

      it('for StopTimeEvent', () => {
        try {
          expect(isValid('StopTimeEvent', {})).not.toBeNull();
        } catch (err) {
          console.log(err);
          throw new Error('Error during schema validation');
        }
      });

      it('for StopTimeUpdate', () => {
        try {
          expect(isValid('StopTimeUpdate', {})).not.toBeNull();
        } catch (err) {
          console.log(err);
          throw new Error('Error during schema validation');
        }
      });

      it('for Timestamp', () => {
        try {
          expect(isValid('Timestamp', {})).not.toBeNull();
        } catch (err) {
          console.log(err);
          throw new Error('Error during schema validation');
        }
      });

      it('for TripDescriptor', () => {
        try {
          expect(isValid('TripDescriptor', {})).not.toBeNull();
        } catch (err) {
          console.log(err);
          throw new Error('Error during schema validation');
        }
      });

      it('for TripUpdate', () => {
        try {
          expect(isValid('TripUpdate', {})).not.toBeNull();
        } catch (err) {
          console.log(err);
          throw new Error('Error during schema validation');
        }
      });

      it('for VehicleDescriptor', () => {
        try {
          expect(isValid('VehicleDescriptor', {})).not.toBeNull();
        } catch (err) {
          console.log(err);
          throw new Error('Error during schema validation');
        }
      });

      it('for VehiclePosition', () => {
        try {
          expect(isValid('VehiclePosition', {})).not.toBeNull();
        } catch (err) {
          console.log(err);
          throw new Error('Error during schema validation');
        }
      });
    });
  });
});

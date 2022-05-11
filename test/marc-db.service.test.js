const db = require('../lib/db');
const gtfsDataExtractors = require('../lib/gtfs-data-extractors');
const { addUpdatedRealtimeStopTimes, addActiveTrips, addActiveTrainPositions } = require('../lib/marc-db.service');

jest.mock('../lib/db');
jest.mock('../lib/gtfs-data-extractors');

describe('MARC DB Service', () => {
  beforeEach(() => {
    Object.keys(db).forEach((mockMethod) => {
      db[mockMethod].mockReset();
    });

    Object.keys(gtfsDataExtractors).forEach((mockMethod) => {
      gtfsDataExtractors[mockMethod].mockReset();
    });
  });

  describe('addUpdatedRealtimeStopTimes', () => {
    it('should upsert if new updated stop times exist', async () => {
      const mergeColumns = ['trip_id', 'start_date', 'stop_sequence'];
      const stopTimeUpdateMockReturn = [{ testField: 1 }, { testField: 2 }];
      gtfsDataExtractors.extractStopTimeUpdates.mockImplementation(() => {
        return stopTimeUpdateMockReturn;
      });
      const upsertMockReturn = { rowCount: 2 };
      db.upsert.mockImplementation(() => {
        return Promise.resolve(upsertMockReturn);
      });
      const testInput = [{ testField: 1, extraField: '1' }, { testField: 2, extraField: '2' }];

      await addUpdatedRealtimeStopTimes(testInput);

      expect(gtfsDataExtractors.extractStopTimeUpdates).toHaveBeenCalledWith(testInput);
      expect(db.upsert).toHaveBeenCalledWith(
        process.env.STOP_TIME_UPDATES_TABLE,
        stopTimeUpdateMockReturn,
        mergeColumns,
      );
    });

    it('should not upsert if no updated stop times exist (empty array)', async () => {
      gtfsDataExtractors.extractStopTimeUpdates.mockImplementation(() => {
        return [];
      });
      const testInput = [{ testField: 1 }, { testField: 2 }];

      await addUpdatedRealtimeStopTimes(testInput);

      expect(gtfsDataExtractors.extractStopTimeUpdates).toHaveBeenCalledWith(testInput);
      expect(db.upsert).not.toHaveBeenCalled();
    });

    it('should not upsert if no updated stop times exist (null)', async () => {
      gtfsDataExtractors.extractStopTimeUpdates.mockImplementation(() => {
        return null;
      });
      const testInput = [{ testField: 1 }, { testField: 2 }];

      await addUpdatedRealtimeStopTimes(testInput);

      expect(gtfsDataExtractors.extractStopTimeUpdates).toHaveBeenCalledWith(testInput);
      expect(db.upsert).not.toHaveBeenCalled();
    });
  });

  describe('addActiveTrips', () => {
    it('should replace old active trips if new ones exist', async () => {
      const activeTripsMockReturn = [{ testField: 1 }, { testField: 2 }];
      gtfsDataExtractors.extractActiveTrips.mockImplementation(() => {
        return activeTripsMockReturn;
      });
      const replaceMockReturn = { rowCount: 2 };
      db.replace.mockImplementation(() => {
        return Promise.resolve(replaceMockReturn);
      });
      const testInput = [{ testField: 1, extraField: '1' }, { testField: 2, extraField: '2' }];

      await addActiveTrips(testInput);

      expect(gtfsDataExtractors.extractActiveTrips).toHaveBeenCalledWith(testInput);
      expect(db.replace).toHaveBeenCalledWith(
        process.env.ACTIVE_TRIPS_TABLE,
        process.env.SHADOW_ACTIVE_TRIPS_TABLE,
        activeTripsMockReturn,
      );
    });

    it('should replace (remove) active trips if new trips do not exist (empty array)', async () => {
      const activeTripsMockReturn = [];
      gtfsDataExtractors.extractActiveTrips.mockImplementation(() => {
        return activeTripsMockReturn;
      });
      const replaceMockReturn = null;
      db.replace.mockImplementation(() => {
        return Promise.resolve(replaceMockReturn);
      });
      const testInput = [{ testField: 1, extraField: '1' }, { testField: 2, extraField: '2' }];

      await addActiveTrips(testInput);

      expect(gtfsDataExtractors.extractActiveTrips).toHaveBeenCalledWith(testInput);
      expect(db.replace).toHaveBeenCalledWith(
        process.env.ACTIVE_TRIPS_TABLE,
        process.env.SHADOW_ACTIVE_TRIPS_TABLE,
        activeTripsMockReturn,
      );
    });

    it('should replace (remove) active trips if new trips do not exist (null)', async () => {
      const activeTripsMockReturn = null;
      gtfsDataExtractors.extractActiveTrips.mockImplementation(() => {
        return activeTripsMockReturn;
      });
      const replaceMockReturn = null;
      db.replace.mockImplementation(() => {
        return Promise.resolve(replaceMockReturn);
      });
      const testInput = [{ testField: 1, extraField: '1' }, { testField: 2, extraField: '2' }];

      await addActiveTrips(testInput);

      expect(gtfsDataExtractors.extractActiveTrips).toHaveBeenCalledWith(testInput);
      expect(db.replace).toHaveBeenCalledWith(
        process.env.ACTIVE_TRIPS_TABLE,
        process.env.SHADOW_ACTIVE_TRIPS_TABLE,
        activeTripsMockReturn,
      );
    });
  });

  describe('addActiveTrainPositions', () => {
    it('should replace old active train positions if new ones exist', async () => {
      const trainPositionsMockReturn = [{ testField: 1 }, { testField: 2 }];
      gtfsDataExtractors.extractTrainPositions.mockImplementation(() => {
        return trainPositionsMockReturn;
      });
      const replaceMockReturn = { rowCount: 2 };
      db.replace.mockImplementation(() => {
        return Promise.resolve(replaceMockReturn);
      });
      const testInput = [{ testField: 1, extraField: '1' }, { testField: 2, extraField: '2' }];

      await addActiveTrainPositions(testInput);

      expect(gtfsDataExtractors.extractTrainPositions).toHaveBeenCalledWith(testInput);
      expect(db.replace).toHaveBeenCalledWith(
        process.env.TRAIN_POSITIONS_TABLE,
        process.env.SHADOW_TRAIN_POSITIONS_TABLE,
        trainPositionsMockReturn,
      );
    });

    it('should replace (remove) active train positions if new ones not exist (empty array)', async () => {
      const trainPositionsMockReturn = [];
      gtfsDataExtractors.extractTrainPositions.mockImplementation(() => {
        return trainPositionsMockReturn;
      });
      const replaceMockReturn = null;
      db.replace.mockImplementation(() => {
        return Promise.resolve(replaceMockReturn);
      });
      const testInput = [{ testField: 1, extraField: '1' }, { testField: 2, extraField: '2' }];

      await addActiveTrainPositions(testInput);

      expect(gtfsDataExtractors.extractTrainPositions).toHaveBeenCalledWith(testInput);
      expect(db.replace).toHaveBeenCalledWith(
        process.env.TRAIN_POSITIONS_TABLE,
        process.env.SHADOW_TRAIN_POSITIONS_TABLE,
        trainPositionsMockReturn,
      );
    });

    it('should replace (remove) active train positions if new ones do not exist (null)', async () => {
      const trainPositionsMockReturn = null;
      gtfsDataExtractors.extractTrainPositions.mockImplementation(() => {
        return trainPositionsMockReturn;
      });
      const replaceMockReturn = null;
      db.replace.mockImplementation(() => {
        return Promise.resolve(replaceMockReturn);
      });
      const testInput = [{ testField: 1, extraField: '1' }, { testField: 2, extraField: '2' }];

      await addActiveTrainPositions(testInput);

      expect(gtfsDataExtractors.extractTrainPositions).toHaveBeenCalledWith(testInput);
      expect(db.replace).toHaveBeenCalledWith(
        process.env.TRAIN_POSITIONS_TABLE,
        process.env.SHADOW_TRAIN_POSITIONS_TABLE,
        trainPositionsMockReturn,
      );
    });
  });
});

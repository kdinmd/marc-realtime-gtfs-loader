require('dotenv').config();
const db = require('../lib/db');

const existingStopTimeUpdatesTableName = process.env.STOP_TIME_UPDATES_TABLE;
const testStopTimeUpdatesTableName = `test_${process.env.STOP_TIME_UPDATES_TABLE}`;
const existingActiveTripsTableName = process.env.ACTIVE_TRIPS_TABLE;
const testActiveTripsTableName = `test_${process.env.ACTIVE_TRIPS_TABLE}`;
const testShadowActiveTripsTableName = `test_shadow_${process.env.ACTIVE_TRIPS_TABLE}`;

describe('Database', () => {
  beforeAll(async () => {
    try {
      await db.dropTable(testStopTimeUpdatesTableName);
      await db
        .createTableLike(testStopTimeUpdatesTableName, existingStopTimeUpdatesTableName);

      await db.dropTable(testActiveTripsTableName);
      await db
        .createTableLike(testActiveTripsTableName, existingActiveTripsTableName);

      await db.dropTable(testShadowActiveTripsTableName);
      await db
        .createTableLike(testShadowActiveTripsTableName, existingActiveTripsTableName);
    } catch (error) {
      console.error(error);
      await db.closeConnection();
    }
  });

  afterAll(async () => {
    try {
      await db.dropTable(testStopTimeUpdatesTableName);
      await db.dropTable(testActiveTripsTableName);
      await db.dropTable(testShadowActiveTripsTableName);
      await db.closeConnection();
    } catch (error) {
      console.error(error);
      await db.closeConnection();
    }
  });

  describe('insert', () => {
    it('should insert a single row into the table', async () => {
      const newRow = {
        trip_id: 'Train700',
        route_id: '11705',
        start_date: '20220507',
        stop_sequence: 6,
        stop_id: '11985',
        arrival_time: 1651951618,
        departure_time: 1651951648,
        vehicle_id: '000027',
        timestamp: 1651951540,
      };
      const result = await db.insert(testStopTimeUpdatesTableName, newRow);
      expect(result.rowCount).toEqual(1);
    });

    it('should insert multiples rows into the table', async () => {
      const newRows = [
        {
          trip_id: 'Train689',
          route_id: '11705',
          start_date: '20220507',
          stop_sequence: 1,
          stop_id: '11979',
          arrival_time: null,
          departure_time: 1651948536,
          vehicle_id: '000027',
          timestamp: 1651951540,
        },
        {
          trip_id: 'Train689',
          route_id: '11705',
          start_date: '20220507',
          stop_sequence: 2,
          stop_id: '11980',
          arrival_time: 1651949796,
          departure_time: 1651950016,
          vehicle_id: '000027',
          timestamp: 1651951540,
        },
        {
          trip_id: 'Train200',
          route_id: '11705',
          start_date: '20220507',
          stop_sequence: 1,
          stop_id: '11981',
          arrival_time: 1651950406,
          departure_time: 1651950456,
          vehicle_id: '000027',
          timestamp: 1651951540,
        },
        {
          trip_id: 'Train200',
          route_id: '11705',
          start_date: '20220507',
          stop_sequence: 2,
          stop_id: '11958',
          arrival_time: 1651953628,
          departure_time: null,
          vehicle_id: '000027',
          timestamp: 1651951540,
        },
      ];
      const result = await db.insert(testStopTimeUpdatesTableName, newRows);
      expect(result.rowCount).toEqual(4);
    });
  });

  describe('select', () => {
    it('should select all rows and columns from the table', async () => {
      const tableColumns = [
        'trip_id',
        'route_id',
        'start_date',
        'stop_sequence',
        'stop_id',
        'arrival_time',
        'departure_time',
        'vehicle_id',
        'timestamp',
        'record_created',
        'updated_at',
      ];
      const result = await db.select(testStopTimeUpdatesTableName);
      expect(result).toHaveLength(5);
      result.forEach((row) => {
        tableColumns.forEach((columnName) => {
          expect(row).toHaveProperty(columnName);
        });
      });
    });

    it('should select all rows with only certain columns', async () => {
      const expectedResult = [
        { trip_id: 'Train689', start_date: '20220507', stop_sequence: 1 },
        { trip_id: 'Train689', start_date: '20220507', stop_sequence: 2 },
        { trip_id: 'Train200', start_date: '20220507', stop_sequence: 1 },
        { trip_id: 'Train200', start_date: '20220507', stop_sequence: 2 },
        { trip_id: 'Train700', start_date: '20220507', stop_sequence: 6 },
      ];
      const result = await db.select(testStopTimeUpdatesTableName, ['trip_id', 'start_date', 'stop_sequence']);
      expect(result).toHaveLength(5);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
      expect(expectedResult).toEqual(expect.arrayContaining(result));
    });

    it('should select only certain rows with all columns', async () => {
      const tableColumns = [
        'trip_id',
        'route_id',
        'start_date',
        'stop_sequence',
        'stop_id',
        'arrival_time',
        'departure_time',
        'vehicle_id',
        'timestamp',
        'record_created',
        'updated_at',
      ];
      const testTripId = 'Train200';
      const result = await db.select(testStopTimeUpdatesTableName, [], { trip_id: testTripId });
      expect(result).toHaveLength(2);
      result.forEach((row) => {
        expect(row.trip_id).toEqual(testTripId);
        tableColumns.forEach((columnName) => {
          expect(row).toHaveProperty(columnName);
        });
      });
    });

    it('should select only certain rows with certain columns', async () => {
      const expectedResult = [
        { trip_id: 'Train689', start_date: '20220507', stop_sequence: 1 },
        { trip_id: 'Train689', start_date: '20220507', stop_sequence: 2 },
      ];
      const result = await db.select(testStopTimeUpdatesTableName, ['trip_id', 'start_date', 'stop_sequence'], { trip_id: 'Train689' });
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
      expect(expectedResult).toEqual(expect.arrayContaining(result));
    });
  });

  describe('upsert', () => {
    it('should upsert a single row into the table', async () => {
      const tableColumns = [
        'trip_id',
        'route_id',
        'start_date',
        'stop_sequence',
        'stop_id',
        'arrival_time',
        'departure_time',
        'vehicle_id',
        'timestamp',
      ];
      const onConflictColumns = ['trip_id', 'start_date', 'stop_sequence'];
      const updatedRow = {
        trip_id: 'Train700',
        route_id: '11705',
        start_date: '20220507',
        stop_sequence: 6,
        stop_id: 'upsert_test_stop_id',
        arrival_time: 1651951618,
        departure_time: 1651951648,
        vehicle_id: '000027',
        timestamp: 1651951540,
      };
      const expectedResult = [{
        trip_id: 'Train700',
        route_id: '11705',
        start_date: '20220507',
        stop_sequence: 6,
        stop_id: 'upsert_test_stop_id',
        arrival_time: '1651951618',
        departure_time: '1651951648',
        vehicle_id: '000027',
        timestamp: '1651951540',
      }];
      const upsertResult = await db
        .upsert(testStopTimeUpdatesTableName, updatedRow, onConflictColumns);
      expect(upsertResult.rowCount).toEqual(1);
      const selectResult = await db
        .select(
          testStopTimeUpdatesTableName,
          tableColumns,
          {
            trip_id: updatedRow.trip_id,
            start_date: updatedRow.start_date,
            stop_sequence: updatedRow.stop_sequence,
          },
        );
      expect(selectResult).toHaveLength(1);
      expect(selectResult).toEqual(expect.arrayContaining(expectedResult));
      expect(expectedResult).toEqual(expect.arrayContaining(selectResult));
    });

    it('should upsert multiples rows into the table', async () => {
      const onConflictColumns = ['trip_id', 'start_date', 'stop_sequence'];
      const updatedRows = [
        {
          trip_id: 'Train689',
          route_id: '11705',
          start_date: '20220507',
          stop_sequence: 1,
          stop_id: '11979_updated',
          arrival_time: null,
          departure_time: 1651948536,
          vehicle_id: '000027',
          timestamp: 1651951540,
        },
        {
          trip_id: 'Train689',
          route_id: '11705',
          start_date: '20220507',
          stop_sequence: 2,
          stop_id: '11980_updated',
          arrival_time: 1651949796,
          departure_time: 1651950016,
          vehicle_id: '000027',
          timestamp: 1651951540,
        },
        {
          trip_id: 'Train200',
          route_id: '11705',
          start_date: '20220507',
          stop_sequence: 1,
          stop_id: '11981_updated',
          arrival_time: 1651950406,
          departure_time: 1651950456,
          vehicle_id: '000027',
          timestamp: 1651951540,
        },
        {
          trip_id: 'Train200',
          route_id: '11705',
          start_date: '20220507',
          stop_sequence: 2,
          stop_id: '11958_updated',
          arrival_time: 1651953628,
          departure_time: null,
          vehicle_id: '000027',
          timestamp: 1651951540,
        },
      ];
      const result = await db.upsert(testStopTimeUpdatesTableName, updatedRows, onConflictColumns);
      expect(result.rowCount).toEqual(4);
    });
  });

  describe('replace', () => {
    it('should insert data into empty table', async () => {
      const newRows = [
        { trip_id: 'id_123', start_date: '20220509' },
        { trip_id: 'id_456', start_date: '20220509' },
        { trip_id: 'id_789', start_date: '20220510' },
      ];
      await db.replace(testActiveTripsTableName, testShadowActiveTripsTableName, newRows);
      // new data should be in active table
      const currentActiveTripsContents = await db.select(testActiveTripsTableName);
      expect(currentActiveTripsContents).toEqual(newRows);
      // shadow table should be empty
      const shadowActiveTripsContents = await db.select(testShadowActiveTripsTableName);
      expect(shadowActiveTripsContents).toEqual([]);
    });

    it('should replace existing data in table', async () => {
      const oldRows = [
        { trip_id: 'id_123', start_date: '20220509' },
        { trip_id: 'id_456', start_date: '20220509' },
        { trip_id: 'id_789', start_date: '20220510' },
      ];
      const newRows = [
        { trip_id: 'id_741', start_date: '20220511' },
        { trip_id: 'id_852', start_date: '20220512' },
      ];
      // verify existing data is in table
      // new data should be in active table
      const existingCurrentActiveTripsContents = await db.select(testActiveTripsTableName);
      expect(existingCurrentActiveTripsContents).toEqual(oldRows);

      await db.replace(testActiveTripsTableName, testShadowActiveTripsTableName, newRows);

      // new data should be in active table
      const currentActiveTripsContents = await db.select(testActiveTripsTableName);
      expect(currentActiveTripsContents).toEqual(newRows);
      // shadow table should be empty
      const shadowActiveTripsContents = await db.select(testShadowActiveTripsTableName);
      expect(shadowActiveTripsContents).toEqual([]);
    });

    it('should empty table if empty array passed', async () => {
      const oldRows = [
        { trip_id: 'id_741', start_date: '20220511' },
        { trip_id: 'id_852', start_date: '20220512' },
      ];
      // verify existing data is in table
      // new data should be in active table
      const existingCurrentActiveTripsContents = await db.select(testActiveTripsTableName);
      expect(existingCurrentActiveTripsContents).toEqual(oldRows);

      await db.replace(testActiveTripsTableName, testShadowActiveTripsTableName, []);

      // new data should be in active table
      const currentActiveTripsContents = await db.select(testActiveTripsTableName);
      expect(currentActiveTripsContents).toEqual([]);
      // shadow table should be empty
      const shadowActiveTripsContents = await db.select(testShadowActiveTripsTableName);
      expect(shadowActiveTripsContents).toEqual([]);
    });
  });
});

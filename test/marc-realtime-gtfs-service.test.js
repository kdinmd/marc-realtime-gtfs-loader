const axios = require('axios');
const fs = require('fs').promises;
const marcRealtimeGtfs = require('../lib/marc-realtime-gtfs.service');

jest.mock('axios');
let gtfsProtoData;

beforeAll(async () => {
  try {
    const gtfsProtoDataRaw = await fs.readFile('test/data/marc.pb');
    gtfsProtoData = new Uint8Array(gtfsProtoDataRaw);
  } catch {
    throw new Error('Failed to load test data proto file');
  }
});

describe('MARC Realtime GTFS Service', () => {
  describe('getRealtimeGTFS', () => {
    it('should get trip updates', async () => {
      const resp = { data: gtfsProtoData, status: 200 };
      axios.get.mockResolvedValue(resp);

      expect.assertions(8);
      const data = await marcRealtimeGtfs.getRealtimeGTFS();
      expect(data).toHaveLength(2);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty(['tripUpdate', 'stopTimeUpdate']);
      expect(data[0]).toHaveProperty(['tripUpdate', 'trip', 'tripId'], 'Train453');
      expect(data[0]).toHaveProperty(['vehicle', 'trip', 'tripId'], 'Train453');
      expect(data[0]).toHaveProperty(['vehicle', 'position']);
      expect(data[0]).toHaveProperty(['vehicle', 'timestamp']);
      expect(data[0]).toHaveProperty(['vehicle', 'vehicle']);
    });

    it('should catch error', async () => {
      axios.get.mockRejectedValue(new Error('Error thrown in getRealtimeGTFS'));

      expect.assertions(1);
      const data = await marcRealtimeGtfs.getRealtimeGTFS();
      expect(data).toEqual(new Error('Error thrown in getRealtimeGTFS'));
    });
  });
});

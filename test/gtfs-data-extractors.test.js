const { getStopTimeUpdates, getActiveTrips, getTrainPositions } = require('../lib/gtfs-data-extractors');

describe('GTFS Data Extractors', () => {
  describe('getStopTimeUpdates', () => {
    it('should return an array of formatted realtime data', () => {
      const testInput = [
        {
          id: '118143',
          tripUpdate: {
            trip: {
              tripId: 'Train453',
              startDate: '20220506',
              routeId: '11705',
            },
            stopTimeUpdate: [
              {
                stopSequence: 1,
                arrival: {
                  delay: 583,
                  time: { unsigned: false, high: 0, low: 1651888273 },
                },
                departure: {
                  delay: 623,
                  time: { unsigned: false, high: 0, low: 1651888343 },
                },
                stopId: '11981',
              },
              {
                stopSequence: 2,
                arrival: {
                  delay: 623,
                  time: { unsigned: false, high: 0, low: 1651888663 },
                },
                departure: {
                  delay: 613,
                  time: { unsigned: false, high: 0, low: 1651888693 },
                },
                stopId: '11982',
              },
            ],
            vehicle: {
              id: '000030',
            },
            timestamp: { unsigned: true, high: 0, low: 1651889241 },
          },
          vehicle: {
            trip: {
              tripId: 'Train453',
              startDate: '20220506',
              routeId: '11705',
            },
            position: {
              latitude: 39.153995513916016,
              longitude: -76.6974868774414,
              bearing: 180,
              speed: 31.607465744018555,
            },
            timestamp: { unsigned: true, high: 0, low: 1651889193 },
            vehicle: {
              id: '000030',
            },
          },
        },
        {
          id: '118147',
          tripUpdate: {
            trip: {
              tripId: 'Train548',
              startDate: '20220506',
              routeId: '11705',
            },
            stopTimeUpdate: [
              {
                stopSequence: 6,
                arrival: {
                  delay: 645,
                  time: { unsigned: false, high: 0, low: 1651888215 },
                },
                departure: {
                  delay: 655,
                  time: { unsigned: false, high: 0, low: 1651888255 },
                },
                stopId: '11994',
              },
              {
                stopSequence: 7,
                arrival: {
                  delay: 795,
                  time: { unsigned: false, high: 0, low: 1651888715 },
                },
                departure: {
                  delay: 785,
                  time: { unsigned: false, high: 0, low: 1651888745 },
                },
                stopId: '11995',
              },
            ],
            vehicle: {
              id: '000031',
            },
            timestamp: { unsigned: true, high: 0, low: 1651889241 },
          },
          vehicle: {
            trip: {
              tripId: 'Train548',
              startDate: '20220506',
              routeId: '11705',
            },
            position: {
              latitude: 39.30726623535156,
              longitude: -76.61407470703125,
              bearing: 117,
            },
            timestamp: { unsigned: true, high: 0, low: 1651889196 },
            vehicle: {
              id: '000031',
            },
          },
        },
      ];

      const expectedOutput = [
        {
          trip_id: 'Train453',
          start_date: '20220506',
          route_id: '11705',
          vehicle_id: '000030',
          timestamp: 1651889241,
          stop_sequence: 1,
          arrival_time: 1651888273,
          departure_time: 1651888343,
          stop_id: '11981',
        },
        {
          trip_id: 'Train453',
          start_date: '20220506',
          route_id: '11705',
          vehicle_id: '000030',
          timestamp: 1651889241,
          stop_sequence: 2,
          arrival_time: 1651888663,
          departure_time: 1651888693,
          stop_id: '11982',
        },
        {
          trip_id: 'Train548',
          start_date: '20220506',
          route_id: '11705',
          vehicle_id: '000031',
          timestamp: 1651889241,
          stop_sequence: 6,
          arrival_time: 1651888215,
          departure_time: 1651888255,
          stop_id: '11994',
        },
        {
          trip_id: 'Train548',
          start_date: '20220506',
          route_id: '11705',
          vehicle_id: '000031',
          timestamp: 1651889241,
          stop_sequence: 7,
          arrival_time: 1651888715,
          departure_time: 1651888745,
          stop_id: '11995',
        },
      ];

      expect(getStopTimeUpdates(testInput)).toEqual(expectedOutput);
    });

    it('should handle trip departure (first) and destination (last) station properly', () => {
      const testInput = [
        {
          id: '118147',
          tripUpdate: {
            trip: {
              tripId: 'Train548',
              startDate: '20220506',
              routeId: '11705',
            },
            stopTimeUpdate: [
              {
                departure: {
                  delay: 83,
                  time: { unsigned: false, high: 0, low: 1651885283 },
                },
                stopId: '11958',
              },
              {
                stopSequence: 12,
                arrival: {
                  delay: 680,
                  time: { unsigned: false, high: 0, low: 1651892300 },
                },
                stopId: '11976',
              },
            ],
            vehicle: {
              id: '000031',
            },
            timestamp: { unsigned: true, high: 0, low: 1651889241 },
          },
          vehicle: {
            trip: {
              tripId: 'Train548',
              startDate: '20220506',
              routeId: '11705',
            },
            position: {
              latitude: 39.30726623535156,
              longitude: -76.61407470703125,
              bearing: 117,
            },
            timestamp: { unsigned: true, high: 0, low: 1651889196 },
            vehicle: {
              id: '000031',
            },
          },
        },
      ];

      const expectedOutput = [
        {
          trip_id: 'Train548',
          start_date: '20220506',
          route_id: '11705',
          vehicle_id: '000031',
          timestamp: 1651889241,
          stop_sequence: undefined,
          arrival_time: null,
          departure_time: 1651885283,
          stop_id: '11958',
        },
        {
          trip_id: 'Train548',
          start_date: '20220506',
          route_id: '11705',
          vehicle_id: '000031',
          timestamp: 1651889241,
          stop_sequence: 12,
          arrival_time: 1651892300,
          departure_time: null,
          stop_id: '11976',
        },
      ];

      expect(getStopTimeUpdates(testInput)).toEqual(expectedOutput);
    });

    it('should return empty array for empty input', () => {
      expect(getStopTimeUpdates([])).toEqual([]);
      expect(getStopTimeUpdates(null)).toEqual([]);
      expect(getStopTimeUpdates(undefined)).toEqual([]);
    });

    it('should return empty array for value missing required fields', () => {
      const testInput = [{
        id: '118143',
        tripUpdate: {
          trip: {
            tripId: 'Train453',
            startDate: '20220506',
            routeId: '11705',
          },
        },
      },
      {
        id: '118143',
        tripUpdate: {
          trip: {
            tripId: 'Train453',
            startDate: '20220506',
            routeId: '11705',
          },
        },
      }];
      expect(getStopTimeUpdates(testInput)).toEqual([]);
    });
  });

  describe('getActiveTrips', () => {
    it('should return an array of active trips', () => {
      const testInput = [
        {
          id: '118143',
          tripUpdate: {
            trip: {
              tripId: 'Train453',
              startDate: '20220506',
              routeId: '11705',
            },
            stopTimeUpdate: [
              {
                stopSequence: 1,
                arrival: {
                  delay: 583,
                  time: { unsigned: false, high: 0, low: 1651888273 },
                },
                departure: {
                  delay: 623,
                  time: { unsigned: false, high: 0, low: 1651888343 },
                },
                stopId: '11981',
              },
              {
                stopSequence: 2,
                arrival: {
                  delay: 623,
                  time: { unsigned: false, high: 0, low: 1651888663 },
                },
                departure: {
                  delay: 613,
                  time: { unsigned: false, high: 0, low: 1651888693 },
                },
                stopId: '11982',
              },
            ],
            vehicle: {
              id: '000030',
            },
            timestamp: { unsigned: true, high: 0, low: 1651889241 },
          },
          vehicle: {
            trip: {
              tripId: 'Train453',
              startDate: '20220506',
              routeId: '11705',
            },
            position: {
              latitude: 39.153995513916016,
              longitude: -76.6974868774414,
              bearing: 180,
              speed: 31.607465744018555,
            },
            timestamp: { unsigned: true, high: 0, low: 1651889193 },
            vehicle: {
              id: '000030',
            },
          },
        },
        {
          id: '118147',
          tripUpdate: {
            trip: {
              tripId: 'Train548',
              startDate: '20220506',
              routeId: '11705',
            },
            stopTimeUpdate: [
              {
                stopSequence: 6,
                arrival: {
                  delay: 645,
                  time: { unsigned: false, high: 0, low: 1651888215 },
                },
                departure: {
                  delay: 655,
                  time: { unsigned: false, high: 0, low: 1651888255 },
                },
                stopId: '11994',
              },
              {
                stopSequence: 7,
                arrival: {
                  delay: 795,
                  time: { unsigned: false, high: 0, low: 1651888715 },
                },
                departure: {
                  delay: 785,
                  time: { unsigned: false, high: 0, low: 1651888745 },
                },
                stopId: '11995',
              },
            ],
            vehicle: {
              id: '000031',
            },
            timestamp: { unsigned: true, high: 0, low: 1651889241 },
          },
          vehicle: {
            trip: {
              tripId: 'Train548',
              startDate: '20220506',
              routeId: '11705',
            },
            position: {
              latitude: 39.30726623535156,
              longitude: -76.61407470703125,
              bearing: 117,
            },
            timestamp: { unsigned: true, high: 0, low: 1651889196 },
            vehicle: {
              id: '000031',
            },
          },
        },
      ];

      const expectedOutput = [
        {
          trip_id: 'Train453',
          start_date: '20220506',
          timestamp: 1651889241,
        },
        {
          trip_id: 'Train548',
          start_date: '20220506',
          timestamp: 1651889241,
        },
      ];

      expect(getActiveTrips(testInput)).toEqual(expectedOutput);
    });

    it('should return empty array for empty input', () => {
      expect(getActiveTrips([])).toEqual([]);
      expect(getActiveTrips(null)).toEqual([]);
      expect(getActiveTrips(undefined)).toEqual([]);
    });
  });

  describe('getTrainPositions', () => {
    it('should return an array of train positions', () => {
      const testInput = [
        {
          id: '118143',
          tripUpdate: {
            trip: {
              tripId: 'Train453',
              startDate: '20220506',
              routeId: '11705',
            },
            stopTimeUpdate: [
              {
                stopSequence: 1,
                arrival: {
                  delay: 583,
                  time: { unsigned: false, high: 0, low: 1651888273 },
                },
                departure: {
                  delay: 623,
                  time: { unsigned: false, high: 0, low: 1651888343 },
                },
                stopId: '11981',
              },
              {
                stopSequence: 2,
                arrival: {
                  delay: 623,
                  time: { unsigned: false, high: 0, low: 1651888663 },
                },
                departure: {
                  delay: 613,
                  time: { unsigned: false, high: 0, low: 1651888693 },
                },
                stopId: '11982',
              },
            ],
            vehicle: {
              id: '000030',
            },
            timestamp: { unsigned: true, high: 0, low: 1651889241 },
          },
          vehicle: {
            trip: {
              tripId: 'Train453',
              startDate: '20220506',
              routeId: '11705',
            },
            position: {
              latitude: 39.153995513916016,
              longitude: -76.6974868774414,
              bearing: 180,
              speed: 31.607465744018555,
            },
            timestamp: { unsigned: true, high: 0, low: 1651889193 },
            vehicle: {
              id: '000030',
            },
          },
        },
        {
          id: '118147',
          tripUpdate: {
            trip: {
              tripId: 'Train548',
              startDate: '20220506',
              routeId: '11705',
            },
            stopTimeUpdate: [
              {
                stopSequence: 6,
                arrival: {
                  delay: 645,
                  time: { unsigned: false, high: 0, low: 1651888215 },
                },
                departure: {
                  delay: 655,
                  time: { unsigned: false, high: 0, low: 1651888255 },
                },
                stopId: '11994',
              },
              {
                stopSequence: 7,
                arrival: {
                  delay: 795,
                  time: { unsigned: false, high: 0, low: 1651888715 },
                },
                departure: {
                  delay: 785,
                  time: { unsigned: false, high: 0, low: 1651888745 },
                },
                stopId: '11995',
              },
            ],
            vehicle: {
              id: '000031',
            },
            timestamp: { unsigned: true, high: 0, low: 1651889241 },
          },
          vehicle: {
            trip: {
              tripId: 'Train548',
              startDate: '20220506',
              routeId: '11705',
            },
            position: {
              latitude: 39.30726623535156,
              longitude: -76.61407470703125,
              bearing: 117,
            },
            timestamp: { unsigned: true, high: 0, low: 1651889196 },
            vehicle: {
              id: '000031',
            },
          },
        },
      ];

      const expectedOutput = [
        {
          trip_id: 'Train453',
          start_date: '20220506',
          vehicle_id: '000030',
          latitude: 39.153995513916016,
          longitude: -76.6974868774414,
          bearing: 180,
          timestamp: 1651889193,
        },
        {
          trip_id: 'Train548',
          start_date: '20220506',
          vehicle_id: '000031',
          latitude: 39.30726623535156,
          longitude: -76.61407470703125,
          bearing: 117,
          timestamp: 1651889196,
        },
      ];

      expect(getTrainPositions(testInput)).toEqual(expectedOutput);
    });

    it('should return empty array for empty input', () => {
      expect(getTrainPositions([])).toEqual([]);
      expect(getTrainPositions(null)).toEqual([]);
      expect(getTrainPositions(undefined)).toEqual([]);
    });
  });
});

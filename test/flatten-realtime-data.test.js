const { flattenRealtimeData } = require('../lib/flatten-realtime-data');

describe('Flatten Realtime Data', () => {
  describe('flattenRealtimeData', () => {
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
                  time: '1651888273',
                },
                departure: {
                  delay: 623,
                  time: '1651888343',
                },
                stopId: '11981',
              },
              {
                stopSequence: 2,
                arrival: {
                  delay: 623,
                  time: '1651888663',
                },
                departure: {
                  delay: 613,
                  time: '1651888693',
                },
                stopId: '11982',
              },
            ],
            vehicle: {
              id: '000030',
            },
            timestamp: '1651889241',
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
            timestamp: '1651889193',
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
                  time: '1651888215',
                },
                departure: {
                  delay: 655,
                  time: '1651888255',
                },
                stopId: '11994',
              },
              {
                stopSequence: 7,
                arrival: {
                  delay: 795,
                  time: '1651888715',
                },
                departure: {
                  delay: 785,
                  time: '1651888745',
                },
                stopId: '11995',
              },
            ],
            vehicle: {
              id: '000031',
            },
            timestamp: '1651889241',
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
            timestamp: '1651889196',
            vehicle: {
              id: '000031',
            },
          },
        },
      ];

      const expectedOutput = [
        {
          tripId: 'Train453',
          startDate: '20220506',
          routeId: '11705',
          vehicleId: '000030',
          timestamp: '1651889241',
          stopSequence: 1,
          arrivalTime: '1651888273',
          departureTime: '1651888343',
          stopId: '11981',
        },
        {
          tripId: 'Train453',
          startDate: '20220506',
          routeId: '11705',
          vehicleId: '000030',
          timestamp: '1651889241',
          stopSequence: 2,
          arrivalTime: '1651888663',
          departureTime: '1651888693',
          stopId: '11982',
        },
        {
          tripId: 'Train548',
          startDate: '20220506',
          routeId: '11705',
          vehicleId: '000031',
          timestamp: '1651889241',
          stopSequence: 6,
          arrivalTime: '1651888215',
          departureTime: '1651888255',
          stopId: '11994',
        },
        {
          tripId: 'Train548',
          startDate: '20220506',
          routeId: '11705',
          vehicleId: '000031',
          timestamp: '1651889241',
          stopSequence: 7,
          arrivalTime: '1651888715',
          departureTime: '1651888745',
          stopId: '11995',
        },
      ];

      expect(flattenRealtimeData(testInput)).toEqual(expectedOutput);
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
                  time: '1651885283',
                },
                stopId: '11958',
              },
              {
                stopSequence: 12,
                arrival: {
                  delay: 680,
                  time: '1651892300',
                },
                stopId: '11976',
              },
            ],
            vehicle: {
              id: '000031',
            },
            timestamp: '1651889241',
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
            timestamp: '1651889196',
            vehicle: {
              id: '000031',
            },
          },
        },
      ];

      const expectedOutput = [
        {
          tripId: 'Train548',
          startDate: '20220506',
          routeId: '11705',
          vehicleId: '000031',
          timestamp: '1651889241',
          departureTime: '1651885283',
          stopId: '11958',
        },
        {
          tripId: 'Train548',
          startDate: '20220506',
          routeId: '11705',
          vehicleId: '000031',
          timestamp: '1651889241',
          stopSequence: 12,
          arrivalTime: '1651892300',
          stopId: '11976',
        },
      ];

      expect(flattenRealtimeData(testInput)).toEqual(expectedOutput);
    });
    it('should return empty array for empty input', () => {
      expect(flattenRealtimeData([])).toEqual([]);
      expect(flattenRealtimeData(null)).toEqual([]);
      expect(flattenRealtimeData(undefined)).toEqual([]);
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
      }];
      expect(flattenRealtimeData(testInput)).toEqual([]);
    });
  });
});

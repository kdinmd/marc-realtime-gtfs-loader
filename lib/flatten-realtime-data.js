const { extractTimeNumber } = require('./util');

const flattenRealtimeData = (trips) => {
  const stopTimes = [];
  let errorOccured = false;
  trips?.forEach((trip) => {
    if (errorOccured) {
      return;
    }

    try {
      trip.tripUpdate.stopTimeUpdate.forEach((timeUpdate) => {
        const newEntry = {};
        newEntry.trip_id = trip.tripUpdate.trip.tripId;
        newEntry.route_id = trip.tripUpdate.trip.routeId;
        newEntry.start_date = trip.tripUpdate.trip.startDate;
        newEntry.stop_sequence = timeUpdate.stopSequence;
        newEntry.stop_id = timeUpdate.stopId;
        newEntry.arrival_time = extractTimeNumber(timeUpdate.arrival?.time);
        newEntry.departure_time = extractTimeNumber(timeUpdate.departure?.time);
        newEntry.vehicle_id = trip.tripUpdate.vehicle.id;
        newEntry.timestamp = extractTimeNumber(trip.tripUpdate.timestamp);
        stopTimes.push(newEntry);
      });
    } catch {
      console.error('Recieved data without required fields');
      errorOccured = true;
    }
  });

  if (errorOccured) {
    return [];
  }

  return stopTimes;
};

module.exports = { flattenRealtimeData };

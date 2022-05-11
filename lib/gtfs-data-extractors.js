const { extractTimeNumber } = require('./utils');

const extractStopTimeUpdates = (trips) => {
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
      console.error('Recieved data without required fields in extractStopTimeUpdates');
      errorOccured = true;
    }
  });

  if (errorOccured) {
    return [];
  }

  return stopTimes;
};

const extractActiveTrips = (trips) => {
  const activeTrips = [];
  let errorOccured = false;
  trips?.forEach((trip) => {
    if (errorOccured) {
      return;
    }

    try {
      const newActiveTrip = {};
      newActiveTrip.trip_id = trip.tripUpdate.trip.tripId;
      newActiveTrip.start_date = trip.tripUpdate.trip.startDate;
      newActiveTrip.timestamp = extractTimeNumber(trip.tripUpdate.timestamp);
      activeTrips.push(newActiveTrip);
    } catch {
      console.error('Error while creating new Active Trips in extractActiveTrips');
      errorOccured = true;
    }
  });

  if (errorOccured) {
    return [];
  }

  return activeTrips;
};

const extractTrainPositions = (trips) => {
  const trainPositions = [];
  let errorOccured = false;
  trips?.forEach((trip) => {
    if (errorOccured) {
      return;
    }

    try {
      const newTrainPosition = {};
      newTrainPosition.trip_id = trip.vehicle.trip.tripId;
      newTrainPosition.start_date = trip.vehicle.trip.startDate;
      newTrainPosition.vehicle_id = trip.vehicle.vehicle.id;
      newTrainPosition.latitude = trip.vehicle.position.latitude;
      newTrainPosition.longitude = trip.vehicle.position.longitude;
      newTrainPosition.bearing = trip.vehicle.position.bearing;
      newTrainPosition.timestamp = extractTimeNumber(trip.vehicle.timestamp);
      trainPositions.push(newTrainPosition);
    } catch {
      console.error('Error while creating new Train Position in extractTrainPositions');
      errorOccured = true;
    }
  });

  if (errorOccured) {
    return [];
  }

  return trainPositions;
};

module.exports = { extractStopTimeUpdates, extractActiveTrips, extractTrainPositions };

const { extractTimeNumber } = require('./utils');
const { isValid } = require('./validation');

const getTripId = (trip, tripUdateFirst = true) => {
  const tripInfoFirst = tripUdateFirst ? trip?.tripUpdate : trip?.vehicle;
  const tripInfoSecond = tripUdateFirst ? trip?.vehicle : trip?.tripUpdate;

  let tripId = '[TRIP ID NOT FOUND]';
  if (tripInfoFirst && isValid('TripDescriptor', tripInfoFirst.trip)) {
    tripId = tripInfoFirst.trip.tripId;
  } else if (tripInfoSecond && isValid('TripDescriptor', tripInfoSecond.trip)) {
    tripId = tripInfoSecond.trip.tripId;
  }

  return tripId;
};

const extractStopTimeUpdates = (trips) => {
  const stopTimes = [];

  trips?.forEach((trip) => {
    try {
      if (trip.tripUpdate && isValid('TripUpdate', trip.tripUpdate)) {
        trip.tripUpdate.stopTimeUpdate.forEach((timeUpdate) => {
          if (isValid('StopTimeUpdate', timeUpdate)) {
            const newEntry = {};
            newEntry.trip_id = trip.tripUpdate.trip.tripId;
            newEntry.route_id = trip.tripUpdate.trip.routeId;
            newEntry.start_date = trip.tripUpdate.trip.startDate;
            newEntry.stop_sequence = timeUpdate.stopSequence;
            newEntry.stop_id = timeUpdate.stopId;
            newEntry.arrival_time = timeUpdate.arrival
              ? extractTimeNumber(timeUpdate.arrival.time) : null;
            newEntry.departure_time = timeUpdate.departure
              ? extractTimeNumber(timeUpdate.departure.time) : null;
            newEntry.vehicle_id = trip.tripUpdate.vehicle?.id;
            newEntry.timestamp = extractTimeNumber(trip.tripUpdate.timestamp);
            stopTimes.push(newEntry);
          }
        });
      } else {
        console.error(`Invalid TripUpdate for tripId '${getTripId(trip)}' encountered in extractStopTimeUpdates.`);
      }
    } catch (err) {
      console.error('Error encountered while creating new stop times in extractStopTimeUpdates');
      console.error(err);
    }
  });

  return stopTimes;
};

const extractActiveTrips = (trips) => {
  const activeTrips = [];

  trips?.forEach((trip) => {
    try {
      let tripInfo;
      if (trip.tripUpdate && isValid('TripDescriptor', trip.tripUpdate.trip)) {
        tripInfo = trip.tripUpdate;
      } else if (trip.vehicle && isValid('TripDescriptor', trip.vehicle.trip)) {
        console.log(`Invalid TripUpdate TripDescriptor for tripId '${trip.vehicle.trip.tripId}'. Defaulting to Vehicle's TripDescriptor`);
        tripInfo = trip.vehicle;
      }

      if (tripInfo) {
        const newActiveTrip = {};
        newActiveTrip.trip_id = tripInfo.trip.tripId;
        newActiveTrip.start_date = tripInfo.trip.startDate;
        newActiveTrip.timestamp = extractTimeNumber(tripInfo.timestamp);
        activeTrips.push(newActiveTrip);
      } else {
        console.error('Invalid trip encountered in extractActiveTrips. No valid TripDescriptor found for trip.');
      }
    } catch (err) {
      console.error('Error encountered while creating new active trips in extractActiveTrips');
      console.error(err);
    }
  });

  return activeTrips;
};

const extractTrainPositions = (trips) => {
  const trainPositions = [];

  trips?.forEach((trip) => {
    try {
      if (trip.vehicle && isValid('VehiclePosition', trip.vehicle)) {
        const newTrainPosition = {};
        newTrainPosition.trip_id = trip.vehicle.trip.tripId;
        newTrainPosition.start_date = trip.vehicle.trip.startDate;
        newTrainPosition.vehicle_id = trip.vehicle.vehicle.id;
        newTrainPosition.latitude = trip.vehicle.position.latitude;
        newTrainPosition.longitude = trip.vehicle.position.longitude;
        newTrainPosition.bearing = trip.vehicle.position.bearing;
        newTrainPosition.timestamp = extractTimeNumber(trip.vehicle.timestamp);

        trainPositions.push(newTrainPosition);
      } else {
        console.error(`Invalid VehiclePosition for tripId '${getTripId(trip, false)}' encountered in extractTrainPositions.`);
      }
    } catch (err) {
      console.error('Error encountered while creating new train positions in extractTrainPositions');
      console.error(err);
    }
  });

  return trainPositions;
};

module.exports = { extractStopTimeUpdates, extractActiveTrips, extractTrainPositions };

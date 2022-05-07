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
        newEntry.tripId = trip.tripUpdate.trip.tripId;
        newEntry.routeId = trip.tripUpdate.trip.routeId;
        newEntry.startDate = trip.tripUpdate.trip.startDate;
        newEntry.stopSequence = timeUpdate.stopSequence;
        newEntry.stopId = timeUpdate.stopId;
        newEntry.arrivalTime = timeUpdate.arrival?.time;
        newEntry.departureTime = timeUpdate.departure?.time;
        newEntry.vehicleId = trip.tripUpdate.vehicle.id;
        newEntry.timestamp = trip.tripUpdate.timestamp;
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

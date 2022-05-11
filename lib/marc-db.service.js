const { upsert, replace } = require('./db');
const { extractStopTimeUpdates, extractActiveTrips, extractTrainPositions } = require('./gtfs-data-extractors');

const addUpdatedRealtimeStopTimes = async (realtimeData) => {
  try {
    const stopTimeUpdates = extractStopTimeUpdates(realtimeData);
    if (stopTimeUpdates && stopTimeUpdates.length > 0) {
      const result = await upsert(process.env.STOP_TIME_UPDATES_TABLE, stopTimeUpdates, ['trip_id', 'start_date', 'stop_sequence']);
      console.log(`${result.rowCount} Realtime Stop Times Added/Updated`);
    } else {
      console.log('No Realtime Stop Times Added/Updated');
    }
  } catch (err) {
    console.error(err);
  }
};

const addActiveTrips = async (realtimeData) => {
  try {
    const activeTrips = extractActiveTrips(realtimeData);
    const result = await replace(
      process.env.ACTIVE_TRIPS_TABLE,
      process.env.SHADOW_ACTIVE_TRIPS_TABLE,
      activeTrips,
    );

    if (result) {
      console.log(`${result.rowCount} Active Trips Added`);
    } else {
      console.log('No Active Trips Added');
    }
  } catch (err) {
    console.error(err);
  }
};

const addActiveTrainPositions = async (realtimeData) => {
  try {
    const trainPositions = extractTrainPositions(realtimeData);
    const result = await replace(
      process.env.TRAIN_POSITIONS_TABLE,
      process.env.SHADOW_TRAIN_POSITIONS_TABLE,
      trainPositions,
    );

    if (result) {
      console.log(`${result.rowCount} Train Positions Added`);
    } else {
      console.log('No Train Positions Added');
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { addUpdatedRealtimeStopTimes, addActiveTrips, addActiveTrainPositions };

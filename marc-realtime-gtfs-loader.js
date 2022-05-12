const { addUpdatedRealtimeStopTimes, addActiveTrips, addActiveTrainPositions } = require('./lib/marc-db.service');
const { getRealtimeGTFS } = require('./lib/marc-realtime-gtfs.service');
const { getTimeout } = require('./lib/utils');

const loadRealtimeMarcData = async () => {
  try {
    const realtimeData = await getRealtimeGTFS();
    await addUpdatedRealtimeStopTimes(realtimeData);
    await addActiveTrips(realtimeData);
    await addActiveTrainPositions(realtimeData);
  } catch (error) {
    console.error(error);
  }
};

const repeatLoadData = async () => {
  try {
    console.log('Start retrieving and loading new data');
    const startTime = new Date();

    await loadRealtimeMarcData();

    const finishTime = new Date();
    const executionTime = finishTime - startTime;
    console.log('Finished retrieving and loading new data.');
    console.log(`Completed in ${executionTime} milliseconds.\n`);

    const timeout = getTimeout(executionTime, process.env.DESIRED_TIMEOUT_SECONDS);

    setTimeout(repeatLoadData, timeout);
  } catch (err) {
    console.error(err);
  }
};

repeatLoadData().catch((error) => {
  console.error(error);
});

const axios = require('axios');
const gtfsRealtimeBindings = require('gtfs-realtime-bindings');

const getRealtimeGTFS = async () => {
  try {
    const response = await axios.get('https://mdotmta-gtfs-rt.s3.amazonaws.com/MARC+RT/marc.pb', {
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    });

    if (response.status === 200) {
      const feed = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(response.data);
      return feed.entity;
    }

    console.error(`GET marc.pb returned failure response code: ${response.status}`);
    return [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = { getRealtimeGTFS };

const KAFKAHOST = "localhost:9092";

const TOPIC_IMMO_RAW = "immo-stream";
const TOPIC_IMMO_AVG = "immo-avg";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTimeSeriesKey(district: number) {
  return `district-${district}`;
}

export { TOPIC_IMMO_RAW, TOPIC_IMMO_AVG, KAFKAHOST, sleep, getTimeSeriesKey };

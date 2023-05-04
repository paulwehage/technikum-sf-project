const TOPIC_IMMO_DATA = "immo-data";
const TOPIC_AVG_PRICES = "avg-prices";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTimeSeriesKey(district: number) {
  return `district-${district}`;
}

export { TOPIC_IMMO_DATA, TOPIC_AVG_PRICES, sleep, getTimeSeriesKey };

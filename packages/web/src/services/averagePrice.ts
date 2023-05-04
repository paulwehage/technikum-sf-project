import { getClient } from "./redis";

async function getAveragePrices() {
  const client = await getClient();

  const data: {
    [district: number]: { price: number; timestamp: number } | null;
  } = {};

  for (let district = 1; district <= 23; district++) {
    const value = await client.ts.get(getTimeSeriesKey(district));
    data[district] = value
      ? {
          price: value.value,
          timestamp: value.timestamp,
        }
      : null;
  }

  return data;
}

function getTimeSeriesKey(district: number) {
  return `district-${district}`;
}

export { getAveragePrices };

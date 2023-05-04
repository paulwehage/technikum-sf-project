import { createClient } from "redis";
import { TimeSeriesDuplicatePolicies } from "@redis/time-series";

import { getTimeSeriesKey } from "@swf/common";

const client = createClient({
  url: process.env.REDIS_URL,
});

async function createTimeSeries() {
  await client.connect();

  for (let district = 1; district <= 23; district++) {
    const key = getTimeSeriesKey(district);
    const exists = await client.exists(key);

    if (exists === 1) {
      console.log(`Timeseries already exists: ${key}`);
      continue;
    }

    const created = await client.ts.create(key, {
      RETENTION: 7 * 86400000,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.LAST,
    });

    if (created === "OK") {
      console.log(`Created timeseries: ${key}`);
    } else {
      console.log(`Error creating timeseries :${key}`);
    }
  }
}

async function init() {
  await createTimeSeries();
}

init()
  .then(() => {
    console.log("Initialization complete");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    process.exit(0);
  });

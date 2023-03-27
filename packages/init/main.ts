import { createClient } from "redis";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";
import { TimeSeriesDuplicatePolicies } from "@redis/time-series";

import { getTimeSeriesKey } from "@swf/common";
import {
  RealEstateAverageMessageSchema,
  RealEstateMessageSchema,
} from "@swf/schema";

const client = createClient();
const registry = new SchemaRegistry(
  { host: "http://localhost:8081" },
  {
    [SchemaType.JSON]: { strict: true },
  }
);

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

async function registerSchemas() {
  await registry.register(
    { type: SchemaType.JSON, schema: JSON.stringify(RealEstateMessageSchema) },
    {
      subject: "RealEstateMessage",
    }
  );

  await registry.register(
    {
      type: SchemaType.JSON,
      schema: JSON.stringify(RealEstateAverageMessageSchema),
    },
    {
      subject: "RealEstateAverageMessageSchema",
    }
  );
}

async function init() {
  await createTimeSeries();
  await registerSchemas();
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

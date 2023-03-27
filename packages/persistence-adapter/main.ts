import { Kafka } from "kafkajs";
import { createClient } from "redis";

import { getTimeSeriesKey, TOPIC_IMMO_AVG } from "@swf/common";
import { RealEstateAverageMessage } from "@swf/schema";

const client = createClient();

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "api",
});

async function main() {
  await client.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_IMMO_AVG, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) {
        return;
      }

      const district = 1;
      const msg = JSON.parse(message.value.toString());
      const date = Date.now();

      await client.ts.add(getTimeSeriesKey(district), date, msg.avg as number);
    },
  });
}

main();

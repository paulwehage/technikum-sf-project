import { Kafka } from "kafkajs";
import { createClient } from "redis";

import { getTimeSeriesKey, sleep, TOPIC_AVG_PRICES } from "@sfr/common";

const client = createClient({
  url: process.env.REDIS_URL,
});

const broker = process.env.KAFKA_HOST ?? "localhost:9092";
const kafka = new Kafka({
  brokers: [broker],
});
const consumer = kafka.consumer({
  groupId: "api",
});

async function main() {
  await client.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_AVG_PRICES, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.key || !message.value) {
        return;
      }

      const district = parseInt(message.key.toString());
      const msg = JSON.parse(message.value.toString());
      const date = Date.now();

      await client.ts.add(getTimeSeriesKey(district), date, msg.avg as number);
    },
  });
}

async function mock() {
  await client.connect();

  while (true) {
    const date = new Date();
    const district = Math.floor(Math.random() * 23) + 1;
    const avgPrice = Math.floor(Math.random() * 1000000) + 100000;

    await client.ts.add(getTimeSeriesKey(district), date, avgPrice as number);

    await sleep(5 * 1000);
  }
}

// main();
mock();

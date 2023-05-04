import { Kafka } from "kafkajs";
import { createClient } from "redis";

import { getTimeSeriesKey, TOPIC_AVG_PRICES } from "@sfr/common";

const client = createClient({
  url: process.env.REDIS_URL,
});

const broker = process.env.KAFKA_HOST ?? "localhost:9092";
const kafka = new Kafka({
  brokers: [broker],
});
const consumer = kafka.consumer({
  groupId: "persistence-adapter",
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

      const date = new Date();
      const district = parseInt(message.key.toString());
      const averagePrice = message.value.readFloatBE();

      await client.ts.add(getTimeSeriesKey(district), date, averagePrice);
      await client.publish(
        "average-price-update",
        JSON.stringify({ district, averagePrice, timestamp: date.getTime() })
      );
    },
  });
}

main();

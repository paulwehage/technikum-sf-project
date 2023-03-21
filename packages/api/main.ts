import { Kafka } from "kafkajs";

import { TOPIC_AVERAGE_PRICE } from "@swf/common";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "api",
});

async function main() {
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_AVERAGE_PRICE, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
    },
  });
}

main();

import { Kafka } from "kafkajs";
import { TOPIC_SHOP_MESSAGES } from "@swf/common";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "shop-crawler",
});

async function main() {
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_SHOP_MESSAGES, fromBeginning: true });

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

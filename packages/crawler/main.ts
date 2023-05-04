import { Kafka } from "kafkajs";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";

import { RealEstateMessageSchema } from "@swf/schema";
import { sleep, TOPIC_IMMO_DATA } from "@swf/common";

const registry = new SchemaRegistry(
  { host: "http://localhost:8081" },
  {
    [SchemaType.JSON]: { strict: true },
  }
);
const kafka = new Kafka({
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

async function crawl() {
  const district = Math.floor(Math.random() * 23) + 1;
  const price = Math.floor(Math.random() * 1000000) + 100000;

  return {
    price,
    district: district.toString(),
    address: "",
    description: "",
  };
}

async function registerSchema() {
  const { id } = await registry.register(
    { type: SchemaType.JSON, schema: JSON.stringify(RealEstateMessageSchema) },
    {
      subject: "RealEstateMessage",
    }
  );

  return id;
}

async function startCrawling() {
  await producer.connect();
  const schemaId = await registerSchema();

  while (true) {
    console.log("Crawling sources...");

    const messages = await Promise.all(
      new Array(10).fill(0).map(async () => {
        const msg = await crawl();

        // const value = await registry.encode(schemaId, msg);

        return {
          key: msg.district,
          value: JSON.stringify(msg),
        };
      })
    );

    await producer.send({
      topic: TOPIC_IMMO_DATA,
      messages,
    });

    await sleep(10 * 1000);
  }
}

startCrawling();

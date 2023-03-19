import { Kafka } from "kafkajs";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";
import { ShopMessage, ShopMessageSchema } from "@swf/schema";

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

async function registerSchema() {
  const { id } = await registry.register(
    { type: SchemaType.JSON, schema: JSON.stringify(ShopMessageSchema) },
    {
      subject: "ShopMessage",
    }
  );
  console.log({ id });

  return id;
}

async function fetchData() {
  console.log("Fetching data...");

  const message: ShopMessage = {
    date: "2021-01-01",
    inStock: true,
    price: 100,
    shopName: "shop1",
  };
  const encoded = await registry.encode(1, message);

  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: encoded }],
  });
}

async function main() {
  await registerSchema();
  await fetchData();
}

main();

import { Kafka } from "kafkajs";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";

const registry = new SchemaRegistry({ host: "http://localhost:8081" });
const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const ShopMessageSchema = {
  type: "record",
  name: "ShopMessage",
  namespace: "examples",
  fields: [
    { name: "shopName", type: "string" },
    { name: "date", type: { type: "string", logicalType: "date" } },
    { name: "inStock", type: "boolean" },
    { name: "price", type: "float" },
  ],
};

async function registerSchema() {
  const schema = JSON.stringify(ShopMessageSchema);
  const { id } = await registry.register({
    type: SchemaType.AVRO,
    schema,
  });

  return id;
}

async function fetchData() {
  console.log("Fetching data...");

  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello KafkaJS user!" }],
  });
}

async function main() {
  const schemaId = await registerSchema();
  console.log(schemaId);
}

main();

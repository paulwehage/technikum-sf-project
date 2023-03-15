import { Kafka } from "kafkajs";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";
import { ShopMessage, ShopMessageSchema } from "schema";

const registry = new SchemaRegistry({ host: "http://registry:8081/" });
const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function registerSchema() {
  const { id } = await registry.register({
    type: SchemaType.AVRO,
    schema: JSON.stringify(ShopMessageSchema),
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

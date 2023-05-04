import { Kafka } from "kafkajs";
import { sleep, TOPIC_IMMO_DATA } from "@sfr/common";

const broker = process.env.KAFKA_HOST ?? "localhost:9092";
const kafka = new Kafka({
  brokers: [broker],
});
const producer = kafka.producer();

async function crawl() {
  const district = Math.floor(Math.random() * 23) + 1;
  const pricePerSquareMeter =
    Math.floor(Math.random() * 5) + 10 + (23 - district);
  const area = Math.floor(Math.random() * 200) + 30;

  return {
    area,
    pricePerSquareMeter,
    district: district.toString(),
    address: "Beispielstraße 1",
    description: "Eine nette Wohnung",
  };
}

async function startCrawling() {
  await producer.connect();

  while (true) {
    console.log("Crawling sources...");

    const messages = await Promise.all(
      new Array(10).fill(0).map(async () => {
        const msg = await crawl();

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

    await sleep(3 * 1000);
  }
}

startCrawling();

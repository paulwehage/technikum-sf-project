import { Kafka } from "kafkajs";

import { KafkaStreams } from "kafka-streams";

const kafkaStreams = new KafkaStreams(config);
kafkaStreams.on("error", (error) => console.error(error));

const kafkaTopicName = "test-topic";
const stream = kafkaStreams.getKStream(kafkaTopicName);
stream.forEach((message) => console.log(message));
stream.start().then(
  () => {
    console.log("stream started, as kafka consumer is ready.");
  },
  (error) => {
    console.log("streamed failed to start: " + error);
  }
);

//format of an incoming kafka message (equals to kafka-node's format)
// {
//   topic: "",
//   value: "",
//   offset: 0,
//   partition: 0,
//   highWaterOffset: 6,
//   key: -1
// }

console.log("Writing sample data to topic");

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });

async function main() {
  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello KafkaJS user!" }],
  });

  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

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

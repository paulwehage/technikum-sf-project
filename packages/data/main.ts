import { Kafka } from "kafkajs";

import { KafkaStreams, KafkaStreamsConfig } from "kafka-streams";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";

import { ShopMessage, ShopMessageSchema } from "@swf/schema";
import { TOPIC_SHOP_MESSAGES, TOPIC_SHOP_AVAILABILITY, TOPIC_AVERAGE_SHOP__PRICE, CONSUMER_GROUP_SHOP_MESSAGES, KAFKAHOST } from "@swf/common";

//format of an incoming kafka message (equals to kafka-node's format)
// {
//   topic: "",
//   value: "",
//   offset: 0,
//   partition: 0,
//   highWaterOffset: 6,
//   key: -1
// }


const config: KafkaStreamsConfig = {
  kafkaHost: KAFKAHOST,
  groupId: CONSUMER_GROUP_SHOP_MESSAGES,
  workerPerPartition: 1,
  batchOptions: {
    batchSize: 5,
    commitEveryNBatch: 1,
    concurrency: 1,
    commitSync: false,
    noBatchCommits: false
  },
    options: {
      sessionTimeout: 8000,
      protocol: ['roundrobin'],
      fromOffset: 'latest',
      fetchMaxBytes: 1024 * 100,
      fetchMinBytes: 1,
      fetchMaxWaitMs: 10,
      heartbeatInterval: 250,
      retryMinTimeout: 250,
      requireAcks: 1,
      ackTimeoutMs: 100,
      partitionerType: 3
  }
};

const kafkaStreams = new KafkaStreams(config);

async function main() {

  const stream = kafkaStreams.getKStream(TOPIC_SHOP_MESSAGES);


  stream.mapJSONConvenience().forEach((message) => console.log(message));
  stream.start().then(
    () => {
      console.log("stream started, as kafka consumer is ready.");
    },
    (error) => {
      console.log("streamed failed to start: " + error);
    }
  );
}

main();

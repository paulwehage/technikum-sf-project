import { KafkaStreams } from "kafka-streams";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";

import { TOPIC_AVERAGE_PRICE, TOPIC_SHOP_MESSAGES } from "@swf/common";
import { ShopMessage } from "@swf/schema";

type AvgState = {
  sum: number;
  count: number;
  avg: number;
};

const factory = new KafkaStreams({
  kafkaHost: "localhost:9092",
});

const registry = new SchemaRegistry(
  { host: "http://localhost:8081" },
  {
    [SchemaType.JSON]: { strict: true },
  }
);

const shopMsgStream = factory.getKStream(TOPIC_SHOP_MESSAGES);

shopMsgStream
  .scan(
    async (currentState, { value }) => {
      const msg: ShopMessage = await registry.decode(value);
      const newState: AvgState = {
        count: currentState.count + 1,
        sum: currentState.sum + msg.price,
        avg: (currentState.sum + msg.price) / currentState.count,
      };

      return newState;
    },
    {
      count: 0,
      sum: 0,
      avg: 0,
    } satisfies AvgState
  )
  .to(TOPIC_AVERAGE_PRICE);

shopMsgStream.start();

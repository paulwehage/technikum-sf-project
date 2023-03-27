import { KafkaStreams } from "kafka-streams";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";

import { TOPIC_IMMO_AVG, TOPIC_IMMO_RAW } from "@swf/common";
import {
  RealEstateMessage,
  RealEstateAverageMessage,
  RealEstateAverageMessageSchema,
} from "@swf/schema";

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

function startDataTransform() {
  //const schemaId = await registerSchema();
  const immostream = factory.getKStream(TOPIC_IMMO_RAW);
  immostream
    .scan(
      (currentStateRaw, { value }) => {
        const currentState = JSON.parse(currentStateRaw) as AvgState;

        if (!value) {
          return currentState;
        }

        const msgRaw = value.subarray(5).toString();
        const msg = JSON.parse(msgRaw) as RealEstateMessage;
        const newState: AvgState = {
          count: currentState.count + 1,
          sum: currentState.sum + (msg.price as number),
          avg: (currentState.sum + (msg.price as number)) / currentState.count,
        };

        //const value = await registry.encode(schemaId, news);

        return JSON.stringify(newState);
      },
      JSON.stringify({
        count: 0,
        sum: 0,
        avg: 0,
      } satisfies AvgState)
    )
    .to(TOPIC_IMMO_AVG);

  immostream.start();
}

startDataTransform();

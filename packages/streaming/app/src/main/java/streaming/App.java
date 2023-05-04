package streaming;

import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.utils.Bytes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.Produced;
import org.apache.kafka.streams.processor.StateStore;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.internals.RocksDBStore;
import org.rocksdb.RocksDB;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class App {

    public static void main(String[] args) {

        StreamsBuilder builder = new StreamsBuilder();

        builder.stream(KafkaHelper.TOPIC_IMMO_DATA, Consumed.with(Serdes.String(), getImmoMessageSerde()))
                .groupByKey().aggregate(Avg::new,
                        (key, immoMessage, aggregator) -> {
                            System.out.println("Preis " + immoMessage.getPrice());
                            return new Avg(0, 0);
                        },
                        Materialized.<String, Avg, KeyValueStore<Bytes, byte[]>>as(
                                KafkaHelper.TOPIC_AGGREGATED_BY_DISTRICT_DATA))
                .toStream().mapValues(Avg::getAvg)
                .to(KafkaHelper.TOPIC_AVG_PRICES, Produced.with(Serdes.String(),
                        Serdes.Double()));

        // Create topology
        Topology topology = builder.build();

        KafkaStreams streams = new KafkaStreams(topology,
                KafkaHelper.getProperties());
        streams.cleanUp();
        streams.start();

        System.out.println("Test");
    }

    public static Serde<ImmoMessage> getImmoMessageSerde() {
        JsonSerializer<ImmoMessage> serializer = new JsonSerializer<>();
        JsonDeserializer<ImmoMessage> deserializer = new JsonDeserializer<>(ImmoMessage.class);
        return Serdes.serdeFrom(serializer, deserializer);
    }

    public static Serde<Avg> getAvgSerde() {
        JsonSerializer<Avg> serializer = new JsonSerializer<>();
        JsonDeserializer<Avg> deserializer = new JsonDeserializer<>(Avg.class);
        return Serdes.serdeFrom(serializer, deserializer);
    }
}

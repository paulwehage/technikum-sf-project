package streaming;

import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.errors.StreamsException;
import org.apache.kafka.streams.kstream.Materialized;

public class App {

    public static void main(String[] args) {
        StreamsBuilder builder = new StreamsBuilder();

        builder.stream("IMMO_RAW").groupBy((key, value) -> key).aggregate(ImmoMessage::new,
                (key, immoMessage, aggregator) -> {

                    return aggregator;
                },
                Materialized.with(Serdes.String(), null));

        // Create topology
        Topology topology = builder.build();

        KafkaStreams streams = new KafkaStreams(topology, KafkaHelper.getProperties());
        streams.cleanUp();
        streams.start();
    }
}

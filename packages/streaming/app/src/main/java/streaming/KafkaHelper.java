package streaming;

import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsConfig;

public class KafkaHelper {

    public final static String TOPIC_IMMO_DATA = "immo-data";
    public final static String TOPIC_AGGREGATED_BY_DISTRICT_DATA = "aggregated-by-district-data";
    public final static String TOPIC_AVG_PRICES = "avg-prices";

    public static Properties getProperties() {
        Properties properties = new Properties();

        // TODO: Read config from environment
        properties.setProperty(StreamsConfig.APPLICATION_ID_CONFIG, "unimmo");
        properties.setProperty(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");

        properties.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, streaming.JsonSerializer.class);
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, streaming.JsonDeserializer.class);

        return properties;
    }
}

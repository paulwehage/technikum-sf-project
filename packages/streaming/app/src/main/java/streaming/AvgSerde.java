package streaming;

import org.apache.kafka.common.serialization.Serdes.WrapperSerde;

public class AvgSerde extends WrapperSerde<Avg> {
    public AvgSerde() {
        super(new JsonSerializer<>(), new JsonDeserializer<>(Avg.class));
    }
}

package streaming;

import org.apache.kafka.streams.kstream.Aggregator;

public class ImmoAggregator implements Aggregator<String, ImmoMessage, Float> {

    @Override
    public Float apply(String key, ImmoMessage value, Float aggregate) {
        return 0F;
    }

}

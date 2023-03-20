const KAFKAHOST = "localhost:9092";
const TOPIC_SHOP_MESSAGES = "shop-messages";
const TOPIC_AVERAGE_SHOP__PRICE = "average_shop_price";
const TOPIC_SHOP_AVAILABILITY = "shop_availability";
const CONSUMER_GROUP_SHOP_MESSAGES = "shop-messages-consumer";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { TOPIC_SHOP_MESSAGES, CONSUMER_GROUP_SHOP_MESSAGES, TOPIC_SHOP_AVAILABILITY, TOPIC_AVERAGE_SHOP__PRICE, KAFKAHOST, sleep };

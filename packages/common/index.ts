const TOPIC_SHOP_MESSAGES = "shop-messages";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { TOPIC_SHOP_MESSAGES, sleep };

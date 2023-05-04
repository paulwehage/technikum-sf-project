import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
});

async function getClient() {
  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}

export { getClient };

import { createClient } from "redis";

const client = createClient();

async function main() {
  await client.connect();

  const value = await client.ts.get("district-1");
  console.log(value);
}

main();

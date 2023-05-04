import { getClient } from "@/services/redis";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Send headers to enable SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const client = await getClient();

  await client.subscribe("average-price-update", (msg) => {
    res.write(`data: ${msg}\n\n`);
    (res as any).flush();
  });
}

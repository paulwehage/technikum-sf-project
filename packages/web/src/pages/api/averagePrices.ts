// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getAveragePrices } from "@/services/averagePrice";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    date: Date;
    data: Awaited<ReturnType<typeof getAveragePrices>>;
  }>
) {
  const date = new Date();
  const data = await getAveragePrices();

  res.status(200).json({
    date,
    data,
  });
}

import jsdom from "jsdom";
import { Kafka } from "kafkajs";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";

import { ShopMessage, ShopMessageSchema } from "@swf/schema";
import { sleep, TOPIC_SHOP_MESSAGES } from "@swf/common";

const { JSDOM } = jsdom;

const registry = new SchemaRegistry(
  { host: "http://localhost:8081" },
  {
    [SchemaType.JSON]: { strict: true },
  }
);
const kafka = new Kafka({
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

type Shop = {
  name: string;
  url: string;
  priceSelector: string;
  stockStateMessage: string;
};

const shops: Shop[] = [
  {
    name: "buyzero",
    url: "https://buyzero.de/products/raspberry-pi-4b?src=raspberrypi&variant=28034031517798",
    priceSelector:
      "#product_form_3529126871142 > div.product-form__info-list > div:nth-child(1) > div > div.price-list > span",
    stockStateMessage: "Ausverkauft",
  },
  {
    name: "Semaf Electronics",
    url: "https://electronics.semaf.at/Raspberry-Pi-4-2GB-Board",
    priceSelector:
      "#product-offer > div.product-info.col-sm-14 > div > div > div.product-offer > div.row > div.col-xs-24.col-sm-12.text-right > div > div.price.text-nowrap > span",
    stockStateMessage: "Nicht auf Lager",
  },
];

async function crawl(shop: Shop) {
  const date = new Date().toISOString();
  const res = await fetch(shop.url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    },
  });

  const rawHtml = await res.text();
  const dom = new JSDOM(rawHtml);

  const inStock = !rawHtml.includes(shop.stockStateMessage);
  const priceRaw = dom.window.document.querySelector(
    shop.priceSelector
  )?.textContent;

  if (!priceRaw) {
    throw new Error(`Could not parse price: ${shop.name}`);
  }

  // How can I extract the price out of this string in JavaScript:
  //                   Angebotspreis53,50 €

  const priceText = priceRaw
    .slice(priceRaw.length - 7, priceRaw.length - 2)
    .replace(",", ".");

  const price = parseFloat(priceText);

  const msg: ShopMessage = {
    date,
    inStock,
    price,
    shopName: shop.name,
  };

  return msg;
}

async function registerSchema() {
  const { id } = await registry.register(
    { type: SchemaType.JSON, schema: JSON.stringify(ShopMessageSchema) },
    {
      subject: "ShopMessage",
    }
  );

  return id;
}

async function startCrawling() {
  await producer.connect();
  const schemaId = await registerSchema();

  while (true) {
    console.log("Crawling shops...");

    for (const shop of shops) {
      let msg: ShopMessage;

      try {
        msg = await crawl(shop);
      } catch (e) {
        console.log(`Could not crawl shop: ${shop.name}`);
        continue;
      }

      const encoded = await registry.encode(schemaId, msg);

      await producer.send({
        topic: TOPIC_SHOP_MESSAGES,
        messages: [{ key: shop.name, value: encoded }],
      });
    }

    await sleep(10 * 1000);
  }
}

startCrawling();

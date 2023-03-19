import Ajv from "ajv";
import { JTDDataType } from "ajv/dist/core";

const ajv = new Ajv();

const ShopMessageSchema = {
  type: "object",
  properties: {
    shopName: { type: "string" },
    date: { type: "string" },
    inStock: { type: "boolean" },
    price: { type: "number" },
  },
  required: ["shopName", "date", "inStock", "price"],
  additionalProperties: false,
};
const validateShopMessage = ajv.compile(ShopMessageSchema);
type ShopMessage = JTDDataType<typeof ShopMessageSchema>;

export { ShopMessage, ShopMessageSchema, validateShopMessage };

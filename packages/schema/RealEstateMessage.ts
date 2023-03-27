import Ajv from "ajv";
import { JTDDataType } from "ajv/dist/core";

const ajv = new Ajv();

const RealEstateMessageSchema = {
  type: "object",
  properties: {
    date: { type: "string" },
    source: { type: "string" },
    price: { type: "number" },
    district: { type: "number" },
    squareMeters: { type: "number" },
  },
  required: ["date", "source", "price", "district", "squareMeters"],
  additionalProperties: false,
};
const validateRealEstateMessage = ajv.compile(RealEstateMessageSchema);
type RealEstateMessage = JTDDataType<typeof RealEstateMessageSchema>;

export {
  RealEstateMessage,
  RealEstateMessageSchema,
  validateRealEstateMessage,
};

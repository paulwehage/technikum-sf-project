import Ajv from "ajv";
import { JTDDataType } from "ajv/dist/core";

const ajv = new Ajv();

const RealEstateMessageSchema = {
  type: "object",
  properties: {
    price: { type: "number" },
    address: { type: "string" },
    description: { type: "string" },
    district: { type: "string" },
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

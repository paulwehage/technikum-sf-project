import Ajv from "ajv";
import { JTDDataType } from "ajv/dist/core";

const ajv = new Ajv();

const RealEstateAverageMessageSchema = {
  type: "object",
  properties: {
    date: { type: "string" },
    avgPrice: { type: "number" },
    district: { type: "number" },
  },
  required: ["date", "avgPrice", "district"],
  additionalProperties: false,
};
const validateRealEstateAverageMessage = ajv.compile(
  RealEstateAverageMessageSchema
);
type RealEstateAverageMessage = JTDDataType<
  typeof RealEstateAverageMessageSchema
>;

export {
  RealEstateAverageMessage,
  RealEstateAverageMessageSchema,
  validateRealEstateAverageMessage,
};

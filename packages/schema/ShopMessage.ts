type ShopMessage = {
  shopName: string;
  date: string;
  inStock: boolean;
  price: number;
};

// const ShopMessageSchema: JSONSchemaType<ShopMessage> = {
//   type: "object",
//   properties: {
//     shopName: {
//       type: "string",
//     },
//     date: {
//       type: "string",
//       format: "date",
//     },
//     inStock: {
//       type: "boolean",
//     },
//     price: {
//       type: "number",
//     },
//   },
//   required: ["shopName", "date", "inStock", "price"],
//   additionalProperties: false,
// };

const ShopMessageSchema = {
  type: "record",
  name: "ShopMessage",
  namespace: "examples",
  fields: [
    { name: "shopName", type: "string" },
    { name: "date", type: { type: "string", logicalType: "date" } },
    { name: "inStock", type: "boolean" },
    { name: "price", type: "float" },
  ],
};

export { ShopMessage, ShopMessageSchema };

import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    inventoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: null, trim: true },
    category: { type: String, default: "Other", trim: true },
    variants: { type: [String], default: [] },
    quantity: { type: Number, required: true, min: 1 },
    refundedQuantity: { type: Number, default: 0, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const saleSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true, index: true },
    items: { type: [saleItemSchema], required: true, minlength: 1 },
    total: { type: Number, required: true, min: 0 },
    refundedTotal: { type: Number, default: 0, min: 0 },
    paymentMethod: { type: String, enum: ["cash", "online"], required: true },
    transactionNumber: { type: String, trim: true, default: "" },
    refunded: { type: Boolean, default: false },
    partiallyRefunded: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Sale", saleSchema);

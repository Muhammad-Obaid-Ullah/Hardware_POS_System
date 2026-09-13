import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    purchasingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumThreshold: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    variants: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("InventoryItem", inventoryItemSchema);

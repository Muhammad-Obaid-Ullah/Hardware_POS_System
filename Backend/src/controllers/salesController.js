import InventoryItem from "../models/InventoryItem.js";
import Sale from "../models/Sale.js";

export async function listSales(request, response) {
  const sales = await Sale.find().sort({ createdAt: -1 });
  response.json({ success: true, data: sales });
}

export async function createSale(request, response) {
  const { items, paymentMethod, transactionNumber = "" } = request.body;

  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({
      success: false,
      message: "At least one item is required for checkout",
    });
  }

  if (!["cash", "online"].includes(paymentMethod)) {
    return response.status(400).json({
      success: false,
      message: "Payment method must be cash or online",
    });
  }

  const itemIds = items.map((item) => item.inventoryItem);
  if (new Set(itemIds).size !== itemIds.length) {
    return response.status(400).json({
      success: false,
      message: "Checkout contains duplicate items",
    });
  }

  const updatedItems = [];
  try {
    for (const requestedItem of items) {
      const quantity = Number(requestedItem.quantity);
      const unitPrice = Number(requestedItem.unitPrice);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      ) {
        throw new Error("Each item needs a valid quantity and price");
      }

      const item = await InventoryItem.findOneAndUpdate(
        {
          _id: requestedItem.inventoryItem,
          stock: { $gte: quantity },
        },
        { $inc: { stock: -quantity } },
        { new: true },
      );

      if (!item) {
        throw new Error("One or more items are out of stock");
      }

      updatedItems.push({ item, quantity, unitPrice });
    }

    const saleItems = updatedItems.map(({ item, quantity, unitPrice }) => ({
      inventoryItem: item._id,
      name: item.name,
      variants: item.variants,
      quantity,
      unitPrice,
    }));
    const total = saleItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const sale = await Sale.create({
      number: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      items: saleItems,
      total,
      paymentMethod,
      transactionNumber: transactionNumber.trim(),
    });

    response.status(201).json({ success: true, data: sale });
  } catch (error) {
    await Promise.all(
      updatedItems.map(({ item, quantity }) =>
        InventoryItem.updateOne(
          { _id: item._id },
          { $inc: { stock: quantity } },
        ),
      ),
    );
    return response.status(400).json({
      success: false,
      message: error.message || "Checkout failed",
    });
  }
}

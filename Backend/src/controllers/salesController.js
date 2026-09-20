import InventoryItem from "../models/InventoryItem.js";
import Sale from "../models/Sale.js";
import mongoose from "mongoose";
import { parseDateBoundary } from "../utils/dateRange.js";

export async function listSales(request, response) {
  const { fromDate, toDate, timeZone = "UTC" } = request.query;
  const createdAt = {};

  if (fromDate) {
    createdAt.$gte = parseDateBoundary(fromDate, false, timeZone);
  }

  if (toDate) {
    createdAt.$lt = parseDateBoundary(toDate, true, timeZone);
  }

  if (createdAt.$gte && createdAt.$lt && createdAt.$gte >= createdAt.$lt) {
    return response.status(400).json({
      success: false,
      message: "fromDate cannot be later than toDate",
    });
  }

  const sales = await Sale.find(
    Object.keys(createdAt).length ? { createdAt } : {},
  ).sort({ createdAt: -1 });
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
      brand: item.brand,
      category: item.category,
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

export async function refundSale(request, response) {
  const { items = [] } = request.body;
  const requestedQuantities = new Map(
    items.map((item) => [String(item.inventoryItem), Number(item.quantity)]),
  );
  const session = await mongoose.startSession();

  try {
    let updatedSale;
    await session.withTransaction(async () => {
      const sale = await Sale.findOne({
        number: request.params.number,
      }).session(session);

      if (!sale) {
        throw new Error("Invoice not found");
      }

      if (sale.refunded) {
        throw new Error("This invoice has already been fully refunded");
      }

      let refundAmount = 0;
      for (const saleItem of sale.items) {
        const currentRemaining =
          saleItem.quantity - (saleItem.refundedQuantity || 0);
        const requestedRemaining = requestedQuantities.has(
          String(saleItem.inventoryItem),
        )
          ? requestedQuantities.get(String(saleItem.inventoryItem))
          : 0;

        if (
          !Number.isInteger(requestedRemaining) ||
          requestedRemaining < 0 ||
          requestedRemaining > currentRemaining
        ) {
          throw new Error("Invalid refund quantity requested");
        }

        const quantityToRefund = currentRemaining - requestedRemaining;
        if (quantityToRefund === 0) continue;

        const inventoryItem = await InventoryItem.findByIdAndUpdate(
          saleItem.inventoryItem,
          { $inc: { stock: quantityToRefund } },
          { new: true, session },
        );

        if (!inventoryItem) {
          throw new Error(`Inventory item ${saleItem.name} no longer exists`);
        }

        saleItem.refundedQuantity =
          (saleItem.refundedQuantity || 0) + quantityToRefund;
        refundAmount += quantityToRefund * saleItem.unitPrice;
      }

      if (refundAmount === 0) {
        throw new Error("No new items were selected for refund");
      }

      sale.refundedTotal = (sale.refundedTotal || 0) + refundAmount;
      const remainingQuantity = sale.items.reduce(
        (sum, item) => sum + item.quantity - (item.refundedQuantity || 0),
        0,
      );
      sale.refunded = remainingQuantity === 0;
      sale.partiallyRefunded = !sale.refunded;
      updatedSale = await sale.save({ session });
    });

    response.json({ success: true, data: updatedSale });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message || "Refund failed",
    });
  } finally {
    await session.endSession();
  }
}

import InventoryItem from "../models/InventoryItem.js";

export async function listInventoryItems(request, response) {
  const items = await InventoryItem.find().sort({ createdAt: -1 });

  response.json({
    success: true,
    data: items,
  });
}

export async function createInventoryItem(request, response) {
  const item = await InventoryItem.create(request.body);

  response.status(201).json({
    success: true,
    data: item,
  });
}

export async function updateInventoryItem(request, response) {
  const item = await InventoryItem.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true },
  );

  if (!item) {
    return response.status(404).json({
      success: false,
      message: "Inventory item not found",
    });
  }

  response.json({ success: true, data: item });
}

export async function deleteInventoryItem(request, response) {
  const item = await InventoryItem.findByIdAndDelete(request.params.id);

  if (!item) {
    return response.status(404).json({
      success: false,
      message: "Inventory item not found",
    });
  }

  response.status(204).end();
}

export async function adjustInventoryStock(request, response) {
  const amount = Number(request.body.amount);
  if (!Number.isFinite(amount) || amount === 0) {
    return response.status(400).json({
      success: false,
      message: "Stock adjustment must be a non-zero number",
    });
  }

  const item = await InventoryItem.findById(request.params.id);
  if (!item) {
    return response.status(404).json({
      success: false,
      message: "Inventory item not found",
    });
  }

  if (amount < -item.stock) {
    return response.status(400).json({
      success: false,
      message: `Cannot remove more than the current stock of ${item.stock}`,
    });
  }

  item.stock += amount;
  await item.save();

  response.json({ success: true, data: item });
}

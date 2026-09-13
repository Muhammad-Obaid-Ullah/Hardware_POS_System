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

import { buildApiUrl } from "./api";

function normalizeItem(item) {
  return {
    ...item,
    id: item._id ?? item.id,
    price: item.sellingPrice,
    brand: item.brand || null,
    variants: Array.isArray(item.variants) ? item.variants : [],
    stock: item.stock ?? 0,
    minimumThreshold: item.minimumThreshold ?? 0,
  };
}

async function request(path, options = {}) {
  const response = await fetch(buildApiUrl(`/api/inventory${path}`), {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Inventory request failed.");
  }

  return data;
}

export async function getInventoryItems() {
  const data = await request("");
  return data.data.map(normalizeItem);
}

export async function createInventoryItem(item) {
  const data = await request("", {
    method: "POST",
    body: JSON.stringify(item),
  });
  return normalizeItem(data.data);
}

export async function updateInventoryItem(id, item) {
  const data = await request(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(item),
  });
  return normalizeItem(data.data);
}

export async function deleteInventoryItem(id) {
  await request(`/${id}`, { method: "DELETE" });
}

export async function adjustInventoryStock(id, amount) {
  const data = await request(`/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ amount }),
  });
  return normalizeItem(data.data);
}

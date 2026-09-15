function normalizeSale(sale) {
  const createdAt = sale.createdAt;
  const dateValue = new Date(createdAt);

  return {
    ...sale,
    id: sale._id ?? sale.id,
    number: sale.number,
    date: dateValue.toLocaleDateString(),
    time: dateValue.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    items: sale.items.map((item) => ({
      ...item,
      id: item.inventoryItem,
      variants: Array.isArray(item.variants) ? item.variants : [],
    })),
  };
}

async function request(path, options = {}) {
  const response = await fetch(`/api/sales${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Sales request failed.");
  }

  return data;
}

export async function getSales() {
  const data = await request("");
  return data.data.map(normalizeSale);
}

export async function createSale(sale) {
  const data = await request("", {
    method: "POST",
    body: JSON.stringify(sale),
  });
  return normalizeSale(data.data);
}

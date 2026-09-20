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
    refundedTotal: sale.refundedTotal ?? 0,
    netTotal: Math.max(0, sale.total - (sale.refundedTotal ?? 0)),
    items: sale.items.map((item) => ({
      ...item,
      id: item.inventoryItem,
      variants: Array.isArray(item.variants) ? item.variants : [],
      remainingQuantity: Math.max(
        0,
        item.quantity - (item.refundedQuantity ?? 0),
      ),
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

export async function getSales(fromDate, toDate) {
  const params = new URLSearchParams();
  params.set("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);
  if (fromDate) params.set("fromDate", fromDate);
  if (toDate) params.set("toDate", toDate);
  const query = params.toString();
  const data = await request(query ? `?${query}` : "");
  return data.data.map(normalizeSale);
}

export async function createSale(sale) {
  const data = await request("", {
    method: "POST",
    body: JSON.stringify(sale),
  });
  return normalizeSale(data.data);
}

export async function refundSale(number, items) {
  const data = await request(`/${number}/refund`, {
    method: "PATCH",
    body: JSON.stringify({
      items: items.map((item) => ({
        inventoryItem: item.inventoryItem ?? item.id,
        quantity: item.quantity,
      })),
    }),
  });
  return normalizeSale(data.data);
}

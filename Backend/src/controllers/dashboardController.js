import InventoryItem from "../models/InventoryItem.js";
import Sale from "../models/Sale.js";
import { parseDateBoundary } from "../utils/dateRange.js";

export async function getDashboardSummary(request, response) {
  const { fromDate, toDate, timeZone = "UTC" } = request.query;
  const createdAt = {};
  if (fromDate) createdAt.$gte = parseDateBoundary(fromDate, false, timeZone);
  if (toDate) createdAt.$lt = parseDateBoundary(toDate, true, timeZone);

  const [sales, inventory] = await Promise.all([
    Sale.find(Object.keys(createdAt).length ? { createdAt } : {})
      .select("number items total refundedTotal paymentMethod createdAt")
      .lean(),
    InventoryItem.find()
      .select(
        "name category brand purchasingPrice sellingPrice stock minimumThreshold",
      )
      .lean(),
  ]);

  const inventoryById = new Map(
    inventory.map((item) => [String(item._id), item]),
  );
  const inferredStart =
    fromDate ||
    sales.reduce((earliest, sale) => {
      const date = formatDateValue(new Date(sale.createdAt), timeZone);
      return !earliest || date < earliest ? date : earliest;
    }, "") ||
    toDate ||
    formatDateValue(new Date(), timeZone);
  const inferredEnd = toDate || formatDateValue(new Date(), timeZone);
  const isHourly = inferredStart === inferredEnd;
  const metrics = {
    totalOrders: 0,
    totalSales: 0,
    netProfit: 0,
    itemsSold: 0,
  };
  const salesByDate = new Map();
  const categoryTotals = new Map();
  const brandTotals = new Map();
  const paymentTotals = new Map([
    ["cash", 0],
    ["online", 0],
  ]);

  sales.forEach((sale) => {
    const netTotal = Math.max(0, sale.total - (sale.refundedTotal || 0));
    let saleProfit = 0;
    let saleItems = 0;
    sale.items.forEach((line) => {
      const remaining = Math.max(
        0,
        line.quantity - (line.refundedQuantity || 0),
      );
      const inventoryItem = inventoryById.get(String(line.inventoryItem));
      const cost = inventoryItem?.purchasingPrice || 0;
      const revenue = remaining * line.unitPrice;
      saleItems += remaining;
      saleProfit += revenue - remaining * cost;
      const category = line.category || inventoryItem?.category || "Other";
      categoryTotals.set(
        category,
        (categoryTotals.get(category) || 0) + remaining,
      );
      const brand = line.brand || inventoryItem?.brand;
      if (brand) {
        brandTotals.set(brand, (brandTotals.get(brand) || 0) + remaining);
      }
    });

    if (saleItems === 0) {
      return;
    }

    metrics.totalOrders += 1;
    metrics.totalSales += netTotal;
    paymentTotals.set(
      sale.paymentMethod,
      (paymentTotals.get(sale.paymentMethod) || 0) + 1,
    );
    metrics.itemsSold += saleItems;
    metrics.netProfit += saleProfit;
    const createdAt = new Date(sale.createdAt);
    const date = isHourly
      ? formatHourLabel(createdAt, timeZone)
      : formatDateLabel(createdAt, timeZone);
    const current = salesByDate.get(date) || { sales: 0, profit: 0 };
    current.sales += netTotal;
    current.profit += saleProfit;
    salesByDate.set(date, current);
  });

  response.json({
    success: true,
    data: {
      metrics,
      rangeStart: inferredStart,
      rangeEnd: inferredEnd,
      trends: [...salesByDate.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, values]) => ({ label, ...values })),
      categories: topEntries(categoryTotals),
      payments: topEntries(paymentTotals),
      brands: topEntries(brandTotals),
      inventory: inventory.map((item) => ({
        item: item.name,
        stock: item.stock,
        threshold: item.minimumThreshold,
      })),
      store: {
        inventoryValue: inventory.reduce(
          (sum, item) => sum + item.stock * item.purchasingPrice,
          0,
        ),
        potentialSales: inventory.reduce(
          (sum, item) => sum + item.stock * item.sellingPrice,
          0,
        ),
        estimatedProfit: inventory.reduce(
          (sum, item) =>
            sum + item.stock * (item.sellingPrice - item.purchasingPrice),
          0,
        ),
        totalCategories: new Set(inventory.map((item) => item.category)).size,
      },
    },
  });
}

function topEntries(map) {
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function formatHourLabel(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone: getSafeTimeZone(timeZone),
  }).format(date);
}

function formatDateLabel(date, timeZone) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: getSafeTimeZone(timeZone),
  });
}

function formatDateValue(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: getSafeTimeZone(timeZone),
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

function getSafeTimeZone(timeZone) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone }).format();
    return timeZone;
  } catch {
    return "UTC";
  }
}

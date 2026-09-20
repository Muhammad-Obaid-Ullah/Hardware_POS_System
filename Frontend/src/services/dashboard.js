export async function getDashboardSummary(fromDate, toDate) {
  const params = new URLSearchParams({
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  if (fromDate) params.set("fromDate", fromDate);
  if (toDate) params.set("toDate", toDate);
  const response = await fetch(`/api/dashboard/summary?${params}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Dashboard request failed.");
  return data.data;
}

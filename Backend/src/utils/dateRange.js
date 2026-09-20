export function parseDateBoundary(value, isEnd, timeZone = "UTC") {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const error = new Error("Dates must use YYYY-MM-DD format");
    error.statusCode = 400;
    throw error;
  }

  const wallTime = new Date(`${value}T00:00:00.000Z`);
  if (isEnd) wallTime.setUTCDate(wallTime.getUTCDate() + 1);

  const safeTimeZone = getSafeTimeZone(timeZone);
  let utcTime = wallTime;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    utcTime = new Date(
      wallTime.getTime() - getTimeZoneOffset(utcTime, safeTimeZone),
    );
  }

  return utcTime;
}

function getTimeZoneOffset(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  const localAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  return localAsUtc - date.getTime();
}

function getSafeTimeZone(timeZone) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone }).format();
    return timeZone;
  } catch {
    return "UTC";
  }
}

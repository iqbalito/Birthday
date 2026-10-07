export const OPEN_DATE = process.env.OPEN_DATE || "2026-10-10";

export const isBDay = function () {
  const startTime = new Date(OPEN_DATE + "T00:00").getTime();
  const endTime = startTime + 24 * 60 * 60 * 1000;
  const localTime = Date.now();
  if (localTime < startTime) return "IS_EARLY";
  if (localTime > endTime) return "IS_LATE";
  return "ON_TIME";
};

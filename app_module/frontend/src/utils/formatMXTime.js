export function formatMXTime(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("es-MX", {
    timeZone: "America/Hermosillo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }) + " (GMT-7)";
}

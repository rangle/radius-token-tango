/**
 * Formats a date into a local date-time string with timezone
 */
export function formatLocalDateTime(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  // Get local timezone abbreviation
  const time = d.toLocaleTimeString("en-us", { timeZoneName: "short" });

  return `${year}-${month}-${day} ${time}`;
}

/**
 * Returns the current date-time as a formatted string
 */
export function strNow(): string {
  return formatLocalDateTime(new Date());
} 
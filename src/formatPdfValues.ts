export function clean(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function formatContractPrice(value: unknown): string {
  const text = clean(value);
  if (!text) return "";
  return text.replace(/¢|cents|\/kWh/gi, "").trim();
}

export function formatDateForPdf(value: unknown): string {
  const text = clean(value);
  if (!text) return "";

  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return text;

  const [, year, month, day] = match;
  return `${month}/${day}/${year.slice(2)}`;
}

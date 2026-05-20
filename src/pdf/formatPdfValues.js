export function clean(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function formatCurrency(value) {
  const text = clean(value);
  if (!text) return "";
  const number = Number(text);
  if (Number.isNaN(number)) return text;
  return number.toFixed(2);
}

export function formatContractPrice(value) {
  const text = clean(value);
  if (!text) return "";
  return text.replace(/¢|cents|\/kWh/gi, "").trim();
}

export function formatDateForPdf(value) {
  const text = clean(value);
  if (!text) return "";

  // HTML date input returns YYYY-MM-DD. The signature field asks MM/DD/YY.
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return text;

  const [, year, month, day] = match;
  return `${month}/${day}/${year.slice(2)}`;
}

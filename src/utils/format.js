export function parseApiDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const hasTimezone = /([zZ])|([+-]\d{2}:?\d{2})$/.test(value);
  const date = new Date(hasTimezone ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatRelativeTime(iso) {
  const date = parseApiDate(iso);
  if (!date) return "";
  const min = Math.round((Date.now() - date.getTime()) / 60000);
  if (min < 1) return "Agora";
  if (min < 60) return `Há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Há ${h} h`;
  return `Há ${Math.floor(h / 24)} d`;
}

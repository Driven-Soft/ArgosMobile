export function formatRelativeTime(iso) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "Agora";
  if (min < 60) return `Há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Há ${h} h`;
  return `Há ${Math.floor(h / 24)} d`;
}

export function formatDistance(meters) {
  if (meters < 1000) return `a ${meters} m`;
  return `a ${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}

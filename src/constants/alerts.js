export const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "ativos", label: "Ativos" },
  { key: "criticos", label: "Críticos" },
];

export const RECOMMENDATIONS = [
  {
    icon: "car",
    text: "Evite vias alagadas e rotas próximas à área afetada.",
  },
  {
    icon: "home",
    text: "Permaneça em local seguro e abrigado até a normalização.",
  },
  {
    icon: "water",
    text: "Não atravesse áreas com água corrente ou acúmulo elevado.",
  },
];

export const EMERGENCY_CONTACTS = "Defesa Civil 199 · Bombeiros 193";

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

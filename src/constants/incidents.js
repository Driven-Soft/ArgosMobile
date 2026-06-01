import { COLORS } from "./theme";

export const INCIDENT_TYPES = [
  { key: "todos", label: "Todos" },
  { key: "alagamento", label: "Alagamento" },
  { key: "deslizamento", label: "Deslizamento" },
  { key: "outro", label: "Outro" },
];

export const INCIDENT_STATUS = {
  em_analise: { label: "Em análise", color: COLORS.riskMedium },
  equipe_a_caminho: { label: "Equipe a caminho", color: COLORS.primary },
  equipe_no_local: { label: "Equipe no local", color: COLORS.riskLow },
  resolvida: { label: "Resolvida", color: COLORS.outlineColor },
};

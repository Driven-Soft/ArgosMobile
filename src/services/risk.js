import { COLORS } from "../constants/theme";

export const RISK_LEVELS = {
  baixo: {
    key: "baixo",
    label: "Baixo",
    color: COLORS.riskLow,
    message: "Situação normal",
  },
  medio: {
    key: "medio",
    label: "Médio",
    color: COLORS.riskMedium,
    message: "Atenção recomendada",
  },
  alto: {
    key: "alto",
    label: "Alto",
    color: COLORS.riskHigh,
    message: "Risco real, evite áreas baixas",
  },
  critico: {
    key: "critico",
    label: "Crítico",
    color: COLORS.riskCritical,
    message: "Perigo iminente, busque local seguro",
  },
};

export const RISK_SCALE = [
  RISK_LEVELS.baixo,
  RISK_LEVELS.medio,
  RISK_LEVELS.alto,
  RISK_LEVELS.critico,
];

function levelFromScore(score) {
  if (score < 0.25) return RISK_LEVELS.baixo;
  if (score < 0.5) return RISK_LEVELS.medio;
  if (score < 0.75) return RISK_LEVELS.alto;
  return RISK_LEVELS.critico;
}

/**
 * Índice de risco de deslizamento.
 * @param {number} precipitacao24h soma de precipitation (hourly) das últimas 24h, em mm
 * @param {number} umidadeSolo soil_moisture_9_to_27cm, em m³/m³
 * @param {number} chuvaAtual precipitation (current), em mm
 * @returns {{ nivel: string, label: string, cor: string, message: string, score: number }}
 */
export function calcularRiscoDeslizamento(
  precipitacao24h,
  umidadeSolo,
  chuvaAtual,
) {
  const pNorm = Math.min((precipitacao24h || 0) / 100, 1); // 100mm = saturação
  const sNorm = Math.min((umidadeSolo || 0) / 0.45, 1); // 0.45 m³/m³ = solo saturado
  const cNorm = Math.min((chuvaAtual || 0) / 20, 1); // 20mm/h = chuva muito forte

  const score = pNorm * 0.55 + sNorm * 0.2 + cNorm * 0.25;
  const level = levelFromScore(score);

  return {
    nivel: level.key,
    label: level.label,
    cor: level.color,
    message: level.message,
    score,
  };
}

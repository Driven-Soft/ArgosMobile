const minutesAgo = (min) => new Date(Date.now() - min * 60_000).toISOString();
const minutesFromNow = (min) => new Date(Date.now() + min * 60_000).toISOString();

const MOCK_ALERTS = [
  {
    id: "alt-1",
    title: "Transbordamento do Rio Tietê",
    riskLevel: "critico",
    location: "Marginal Tietê, Casa Verde",
    zone: "Norte",
    author: "Defesa Civil",
    description:
      "Nível do rio acima da cota de inundação. Evacuação preventiva das áreas ribeirinhas em andamento.",
    active: true,
    latitude: -23.5089,
    longitude: -46.6388,
    createdAt: minutesAgo(8),
    validUntil: minutesFromNow(180),
  },
  {
    id: "alt-2",
    title: "Risco de deslizamento em encosta",
    riskLevel: "alto",
    location: "Jardim Ângela, Zona Sul",
    zone: "Sul",
    author: "Defesa Civil",
    description:
      "Solo saturado após chuvas intensas. Moradores de áreas de encosta devem redobrar a atenção.",
    active: true,
    latitude: -23.6821,
    longitude: -46.7635,
    createdAt: minutesAgo(35),
    validUntil: minutesFromNow(240),
  },
  {
    id: "alt-3",
    title: "Alagamento de vias",
    riskLevel: "medio",
    location: "Vila Prudente, Zona Leste",
    zone: "Leste",
    author: "Defesa Civil",
    description:
      "Pontos de acúmulo de água em vias principais. Trânsito lento e desvios pontuais.",
    active: true,
    latitude: -23.5849,
    longitude: -46.5805,
    createdAt: minutesAgo(72),
    validUntil: minutesFromNow(120),
  },
  {
    id: "alt-4",
    title: "Chuva forte com rajadas de vento",
    riskLevel: "medio",
    location: "Pinheiros, Zona Oeste",
    zone: "Oeste",
    author: "Defesa Civil",
    description:
      "Previsão de temporal isolado nas próximas horas. Risco de queda de galhos e destelhamentos.",
    active: true,
    latitude: -23.5629,
    longitude: -46.6544,
    createdAt: minutesAgo(120),
    validUntil: minutesFromNow(90),
  },
  {
    id: "alt-5",
    title: "Atenção a córregos urbanos",
    riskLevel: "baixo",
    location: "Sé, Centro",
    zone: "Central",
    author: "Defesa Civil",
    description:
      "Situação controlada. Monitoramento preventivo dos níveis dos córregos da região central.",
    active: false,
    latitude: -23.5505,
    longitude: -46.6333,
    createdAt: minutesAgo(260),
    validUntil: minutesAgo(30),
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retorna os alertas oficiais. Simula latência de rede.
 * @returns {Promise<Array>}
 */
export async function fetchAlerts() {
  await delay(300);
  return [...MOCK_ALERTS];
}

/**
 * Busca um alerta pelo id.
 * @returns {Promise<object|null>}
 */
export async function getAlert(id) {
  await delay(150);
  return MOCK_ALERTS.find((a) => a.id === id) ?? null;
}

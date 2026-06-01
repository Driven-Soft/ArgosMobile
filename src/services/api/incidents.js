const minutesAgo = (min) => new Date(Date.now() - min * 60_000).toISOString();

const MOCK_INCIDENTS = [
  {
    id: "inc-1",
    title: "Rua alagada na Marginal",
    type: "alagamento",
    riskLevel: "critico",
    status: "equipe_a_caminho",
    description: "Água acima do meio-fio, trânsito interrompido.",
    neighborhood: "Bela Vista",
    distance: 200,
    latitude: -23.5089,
    longitude: -46.6388,
    createdAt: minutesAgo(5),
  },
  {
    id: "inc-2",
    title: "Deslizamento de barreira",
    type: "deslizamento",
    riskLevel: "alto",
    status: "equipe_no_local",
    description: "Queda parcial de talude próximo a residências.",
    neighborhood: "Vila Madalena",
    distance: 1200,
    latitude: -23.5905,
    longitude: -46.6533,
    createdAt: minutesAgo(42),
  },
  {
    id: "inc-3",
    title: "Acúmulo de água em via",
    type: "alagamento",
    riskLevel: "medio",
    status: "em_analise",
    description: "Bueiro entupido causando poça grande.",
    neighborhood: "Sé",
    distance: 850,
    latitude: -23.5475,
    longitude: -46.6361,
    createdAt: minutesAgo(95),
  },
  {
    id: "inc-4",
    title: "Risco de queda de árvore",
    type: "outro",
    riskLevel: "baixo",
    status: "resolvida",
    description: "Árvore inclinada após ventania, sem bloqueio.",
    neighborhood: "Pinheiros",
    distance: 3400,
    latitude: -23.5629,
    longitude: -46.6544,
    createdAt: minutesAgo(310),
  },
];

// Comentários (chat) por ocorrência — mock em memória. O backend real armazenaria isso num banco de dados.
const MOCK_COMMENTS = {
  "inc-1": [
    {
      id: "c1",
      author: "Defesa Civil",
      role: "defesa_civil",
      text: "Equipe a caminho do local. Evitem a via.",
      createdAt: minutesAgo(3),
    },
    {
      id: "c2",
      author: "Você",
      role: "cidadao",
      text: "Obrigado, o nível da água continua subindo.",
      createdAt: minutesAgo(1),
    },
  ],
  "inc-2": [
    {
      id: "c3",
      author: "Defesa Civil",
      role: "defesa_civil",
      text: "Área isolada, equipe no local avaliando o talude.",
      createdAt: minutesAgo(20),
    },
  ],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retorna as ocorrências reportadas. Simula latência de rede.
 * @returns {Promise<Array>}
 */
export async function fetchIncidents() {
  await delay(300);
  return [...MOCK_INCIDENTS];
}

/**
 * Busca uma ocorrência pelo id.
 * @returns {Promise<object|null>}
 */
export async function getIncident(id) {
  await delay(150);
  return MOCK_INCIDENTS.find((i) => i.id === id) ?? null;
}

/**
 * Comentários (chat) de uma ocorrência.
 * @returns {Promise<Array>}
 */
export async function fetchComments(incidentId) {
  await delay(200);
  return [...(MOCK_COMMENTS[incidentId] ?? [])];
}

/**
 * Cria uma nova ocorrência (mock em memória). O backend real definiria
 * riskLevel/status/author; aqui usamos padrões de "recém-reportada".
 * @returns {Promise<object>} a ocorrência criada
 */
export async function createIncident({
  title,
  type,
  description,
  latitude,
  longitude,
  neighborhood = "Local reportado",
}) {
  await delay(400);
  const incident = {
    id: `inc-${Date.now()}`,
    title,
    type,
    riskLevel: "medio", // avaliação de gravidade fica a cargo da Defesa Civil
    status: "em_analise",
    description,
    neighborhood,
    distance: 0,
    latitude,
    longitude,
    createdAt: new Date().toISOString(),
  };
  MOCK_INCIDENTS.unshift(incident);
  return incident;
}

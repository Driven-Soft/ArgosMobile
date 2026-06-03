import { http } from "../http";

// Tipos de ocorrência — /tipos-ocorrencia
let cache = null;

export async function fetchIncidentTypes() {
  if (cache) return cache;
  const { data } = await http.get("/tipos-ocorrencia");
  cache = data ?? [];
  return cache;
}

export async function resolveTypeId(chave) {
  const types = await fetchIncidentTypes();
  return types.find((t) => t.chave === chave)?.id ?? null;
}

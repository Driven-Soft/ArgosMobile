import { http } from "../http";

// Alertas — /alertas

function mapAlert(a) {
  return {
    id: String(a.id),
    title: a.titulo,
    riskLevel: (a.nivelAlerta ?? "BAIXO").toLowerCase(),
    location: a.localizacao,
    zone: a.zona,
    author: a.autor,
    description: a.descricao,
    active: a.ativo,
    latitude: a.latitude,
    longitude: a.longitude,
    createdAt: a.dataCriacao,
    validUntil: a.fimVigencia,
  };
}

export async function fetchAlerts() {
  const { data } = await http.get("/alertas");
  return (data ?? []).map(mapAlert);
}

export async function getAlert(id) {
  const { data } = await http.get(`/alertas/${id}`);
  return data ? mapAlert(data) : null;
}

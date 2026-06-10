import { http } from "../http";
import { getCurrentUserId, addOwnedIncident } from "../session";
import { resolveTypeId } from "./types";

// Ocorrências e comentários — /ocorrencias

function mapIncident(o) {
  return {
    id: String(o.id),
    title: o.titulo,
    type: o.tipo,
    riskLevel: (o.nivelRisco ?? "MEDIO").toLowerCase(),
    status: (o.status ?? "EM_ANALISE").toLowerCase(),
    description: o.descricao,
    neighborhood: o.bairro ?? "Local reportado",
    latitude: o.latitude,
    longitude: o.longitude,
    createdAt: o.dataCriacao,
  };
}

function mapComment(c) {
  return {
    id: String(c.id),
    author: c.autor,
    role: c.papel,
    text: c.texto,
    createdAt: c.dataCriacao,
  };
}

export async function fetchIncidents() {
  const { data } = await http.get("/ocorrencias");
  return (data ?? []).map(mapIncident);
}

export async function fetchComments(incidentId) {
  const { data } = await http.get(`/ocorrencias/${incidentId}/comentarios`);
  return (data ?? []).map(mapComment);
}

export async function createIncident({
  title,
  type,
  description,
  latitude,
  longitude,
}) {
  const usuarioId = await getCurrentUserId();
  if (!usuarioId) {
    throw new Error(
      "Sessão expirada. Faça login para registrar uma ocorrência.",
    );
  }
  const tipoOcorrenciaId = await resolveTypeId(type);
  if (!tipoOcorrenciaId) {
    throw new Error("Tipo de ocorrência inválido.");
  }

  const { data } = await http.post("/ocorrencias", {
    titulo: title,
    descricao: description,
    tipoOcorrenciaId,
    usuarioId,
    latitude,
    longitude,
  });
  const incident = mapIncident(data);
  // A API não devolve o autor; guardamos o id localmente para liberar a
  // exclusão posteriormente (ver session.js).
  await addOwnedIncident(incident.id);
  return incident;
}

export async function deleteIncident(id) {
  await http.delete(`/ocorrencias/${id}`);
}

export async function createComment(incidentId, message) {
  const usuarioId = await getCurrentUserId();
  if (!usuarioId) {
    throw new Error("Sessão expirada. Faça login para comentar.");
  }

  const { data } = await http.post(`/ocorrencias/${incidentId}/comentarios`, {
    mensagem: message,
    usuarioId,
  });
  return mapComment(data);
}

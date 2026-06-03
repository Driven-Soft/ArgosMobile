import { http } from "../http";

export async function createUser({
  nome,
  email,
  senha,
  telefone,
  tipoUsuario = "CIDADAO",
}) {
  const { data } = await http.post("/usuarios", {
    nome,
    email,
    senha,
    telefone,
    tipoUsuario,
  });
  return data;
}

export async function getUser(id) {
  const { data } = await http.get(`/usuarios/${id}`);
  return data;
}

export async function findUserByEmail(email) {
  const { data } = await http.get("/usuarios");
  const target = (email ?? "").trim().toLowerCase();
  return (
    (data ?? []).find((u) => (u.email ?? "").toLowerCase() === target) ?? null
  );
}

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

export async function updateUser(
  id,
  { nome, senha, telefone, tipoUsuario = "CIDADAO", ativo = true },
) {
  const { data } = await http.patch(`/usuarios/${id}`, {
    nome,
    senha,
    telefone,
    tipoUsuario,
    ativo,
  });
  return data;
}

export async function findUserByEmail(email) {
  const { data } = await http.get("/usuarios");
  const target = (email ?? "").trim().toLowerCase();
  return (
    (data ?? []).find((u) => (u.email ?? "").toLowerCase() === target) ?? null
  );
}

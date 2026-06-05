import AsyncStorage from "@react-native-async-storage/async-storage";

// Identidade do usuário no app. Não há login no servidor: o `id` devolvido no
// cadastro (POST /usuarios) é guardado localmente e reenviado como `usuarioId`
// nas operações de escrita.

export const USER_KEY = "@argos:user";
export const SESSION_KEY = "@argos:session";
export const OWNED_INCIDENTS_KEY = "@argos:ownedIncidents";

/** Usuário salvo localmente (inclui o `id` retornado pela API). */
export async function getStoredUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/** Id do usuário logado, usado como `usuarioId` nas escritas. */
export async function getCurrentUserId() {
  const user = await getStoredUser();
  return user?.id ?? null;
}

/** Persiste o usuário e abre a sessão local. */
export async function saveSession(user) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(SESSION_KEY, "true");
}

/** Ids das ocorrências criadas por este usuário (rastreio local). */
export async function getOwnedIncidentIds() {
  const raw = await AsyncStorage.getItem(OWNED_INCIDENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** Marca uma ocorrência como criada pelo usuário. */
export async function addOwnedIncident(id) {
  const ids = await getOwnedIncidentIds();
  const key = String(id);
  if (!ids.includes(key)) {
    await AsyncStorage.setItem(
      OWNED_INCIDENTS_KEY,
      JSON.stringify([...ids, key]),
    );
  }
}

/** Remove o rastreio local de uma ocorrência (ex.: após excluí-la). */
export async function removeOwnedIncident(id) {
  const ids = await getOwnedIncidentIds();
  const key = String(id);
  await AsyncStorage.setItem(
    OWNED_INCIDENTS_KEY,
    JSON.stringify(ids.filter((i) => i !== key)),
  );
}

/** Indica se a ocorrência foi criada por este usuário. */
export async function isOwnedIncident(id) {
  const ids = await getOwnedIncidentIds();
  return ids.includes(String(id));
}

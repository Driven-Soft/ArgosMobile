import AsyncStorage from "@react-native-async-storage/async-storage";

// Identidade do usuário no app. Não há login no servidor: o `id` devolvido no
// cadastro (POST /usuarios) é guardado localmente e reenviado como `usuarioId`
// nas operações de escrita.

export const USER_KEY = "@argos:user";
export const SESSION_KEY = "@argos:session";

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

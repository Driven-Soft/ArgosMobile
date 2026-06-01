import * as Location from "expo-location";

// Fallback: centro de São Paulo, caso o usuário negue permissão ou ocorra erro.
export const DEFAULT_LOCATION = {
  latitude: -23.55,
  longitude: -46.63,
  isFallback: true,
};

/**
 * Tenta obter a posição atual do usuário. Se a permissão for negada ou
 * ocorrer qualquer erro, retorna a coordenada padrão (São Paulo).
 * @returns {Promise<{ latitude: number, longitude: number, isFallback: boolean }>}
 */
export async function getCurrentLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return DEFAULT_LOCATION;

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      isFallback: false,
    };
  } catch {
    return DEFAULT_LOCATION;
  }
}

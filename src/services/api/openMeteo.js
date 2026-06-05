import axios from "axios";

import { calcularRiscoDeslizamento } from "../risk";

const forecastClient = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
  timeout: 15000,
});

const geocodingClient = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
  timeout: 15000,
});

const TIMEZONE = "America/Sao_Paulo";

export const GRID_SPACING = {
  cidade: 0.08, // ~9 km — visão local
  estado: 0.3, // ~33 km — visão regional
};

/**
 * Monta um grid quadrado (size x size) de coordenadas ao redor de um centro.
 * @returns {Array<{ latitude: number, longitude: number }>}
 */
export function buildGrid(center, spacing = GRID_SPACING.cidade, size = 3) {
  const points = [];
  const half = Math.floor(size / 2);
  for (let row = -half; row <= half; row++) {
    for (let col = -half; col <= half; col++) {
      points.push({
        latitude: center.latitude + row * spacing,
        longitude: center.longitude + col * spacing,
      });
    }
  }
  return points;
}

function sum(arr) {
  if (!Array.isArray(arr)) return 0;
  return arr.reduce((acc, v) => acc + (typeof v === "number" ? v : 0), 0);
}

function lastNumber(arr) {
  if (!Array.isArray(arr)) return 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (typeof arr[i] === "number") return arr[i];
  }
  return 0;
}

/**
 * Busca dados meteorológicos para cada ponto do grid e calcula o risco.
 * Usa uma única chamada com coordenadas separadas por vírgula.
 * @returns {Promise<Array<{ latitude, longitude, risk }>>}
 */
export async function fetchRiskGrid(points) {
  const latitude = points.map((p) => p.latitude.toFixed(4)).join(",");
  const longitude = points.map((p) => p.longitude.toFixed(4)).join(",");

  const { data } = await forecastClient.get("/forecast", {
    params: {
      latitude,
      longitude,
      current: "precipitation,rain,weather_code",
      hourly: "precipitation,soil_moisture_9_to_27cm",
      past_hours: 24,
      forecast_hours: 1,
      timezone: TIMEZONE,
    },
  });

  const locations = Array.isArray(data) ? data : [data];

  return locations.map((loc, index) => {
    const base = points[index] ?? points[0];
    const precip24h = sum(loc?.hourly?.precipitation);
    const soilMoisture = lastNumber(loc?.hourly?.soil_moisture_9_to_27cm);
    const currentRain = loc?.current?.precipitation ?? 0;

    return {
      latitude: base.latitude,
      longitude: base.longitude,
      precip24h,
      soilMoisture,
      currentRain,
      weatherCode: loc?.current?.weather_code ?? null,
      risk: calcularRiscoDeslizamento(precip24h, soilMoisture, currentRain),
    };
  });
}

/**
 * Geocodifica um nome de lugar (cidade, bairro, endereço).
 * @returns {Promise<Array<{ id, name, latitude, longitude, admin1, country }>>}
 */
export async function geocode(query) {
  const term = query.trim();
  if (!term) return [];

  const { data } = await geocodingClient.get("/search", {
    params: { name: term, count: 6, language: "pt", format: "json" },
  });

  return (data?.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    admin1: r.admin1 ?? null, // estado
    country: r.country ?? null,
  }));
}

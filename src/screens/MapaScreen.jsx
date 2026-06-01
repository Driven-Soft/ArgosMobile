import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker, Circle, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import MapSearchBar from "../components/map/MapSearchBar";
import RiskLegend from "../components/map/RiskLegend";
import NearbyZonesSheet from "../components/map/NearbyZonesSheet";
import {
  buildGrid,
  fetchRiskGrid,
  GRID_SPACING,
} from "../services/api/openMeteo";
import { fetchIncidents } from "../services/api/incidents";
import { getCurrentLocation, DEFAULT_LOCATION } from "../services/location";
import { RISK_LEVELS } from "../services/risk";
import { COLORS, FONTS } from "../constants/theme";

const INCIDENT_ICONS = {
  alagamento: "water",
  deslizamento: "triangle",
  outro: "alert-circle",
};

// Converte o espaçamento do grid (graus) num raio de círculo (metros) que
// gera sobreposição suave entre os pontos vizinhos.
function circleRadiusFor(spacing) {
  return spacing * 111320 * 0.62;
}

function regionFor(center, spacing) {
  const delta = spacing * 4;
  return {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  const [center, setCenter] = useState(DEFAULT_LOCATION);
  const [scope, setScope] = useState("cidade");
  const [grid, setGrid] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [recentering, setRecentering] = useState(false);

  const loadRisk = useCallback(async (nextCenter, nextScope) => {
    setLoading(true);
    setError(null);
    try {
      const spacing = GRID_SPACING[nextScope];
      const points = buildGrid(nextCenter, spacing);
      const data = await fetchRiskGrid(points);
      setGrid(data);
    } catch {
      setError("Não foi possível carregar os dados de risco.");
      setGrid([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const loc = await getCurrentLocation();
      if (!active) return;
      setCenter(loc);
      setIsFallback(loc.isFallback);
      if (!loc.isFallback) animateTo(loc, scope);
      await loadRisk(loc, scope);
      const list = await fetchIncidents();
      if (active) setIncidents(list);
    })();
    return () => {
      active = false;
    };
  }, []);

  function animateTo(nextCenter, nextScope = scope) {
    mapRef.current?.animateToRegion(
      regionFor(nextCenter, GRID_SPACING[nextScope]),
      450,
    );
  }

  function handleScopeChange(nextScope) {
    if (nextScope === scope) return;
    setScope(nextScope);
    animateTo(center, nextScope);
    loadRisk(center, nextScope);
  }

  function handleSelectPlace(place) {
    const nextCenter = {
      latitude: place.latitude,
      longitude: place.longitude,
      isFallback: false,
    };
    setCenter(nextCenter);
    setIsFallback(false);
    animateTo(nextCenter);
    loadRisk(nextCenter, scope);
  }

  async function handleRecenter() {
    if (recentering) return;
    setRecentering(true);
    try {
      const loc = await getCurrentLocation();
      setCenter(loc);
      setIsFallback(loc.isFallback);
      animateTo(loc, scope);
      await loadRisk(loc, scope);
    } finally {
      setRecentering(false);
    }
  }

  function handleSelectZone(zone) {
    mapRef.current?.animateToRegion(
      {
        latitude: zone.latitude,
        longitude: zone.longitude,
        latitudeDelta: GRID_SPACING[scope] * 1.5,
        longitudeDelta: GRID_SPACING[scope] * 1.5,
      },
      450,
    );
  }

  const radius = circleRadiusFor(GRID_SPACING[scope]);

  return (
    <View className="flex-1 bg-background">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={regionFor(center, GRID_SPACING[scope])}
        showsUserLocation={!isFallback}
        showsMyLocationButton={false}
      >
        {grid.map((point) => (
          <Circle
            key={`${point.latitude}-${point.longitude}`}
            center={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            radius={radius}
            strokeWidth={0}
            fillColor={point.risk.cor + "40"}
          />
        ))}

        {incidents.map((incident) => {
          const color =
            RISK_LEVELS[incident.riskLevel]?.color ?? COLORS.textMutedColor;
          return (
            <Marker
              key={incident.id}
              coordinate={{
                latitude: incident.latitude,
                longitude: incident.longitude,
              }}
            >
              <View
                className="h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color }}
              >
                <Ionicons
                  name={INCIDENT_ICONS[incident.type] ?? "alert-circle"}
                  size={18}
                  color="#ffffff"
                />
              </View>
              <Callout tooltip>
                <View className="w-56 rounded-2xl bg-surface p-3 shadow-lg">
                  <View className="flex-row items-center gap-1.5">
                    <View
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <Text
                      className="flex-1 text-[14px] text-textColor"
                      style={{ fontFamily: FONTS.semibold }}
                    >
                      {incident.title}
                    </Text>
                  </View>
                  <Text
                    className="mt-1 text-[12px] text-textMutedColor"
                    style={{ fontFamily: FONTS.regular }}
                  >
                    {incident.description}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View
        className="absolute inset-x-0 gap-2.5 px-4"
        style={{ top: insets.top + 8 }}
        pointerEvents="box-none"
      >
        <MapSearchBar
          scope={scope}
          onScopeChange={handleScopeChange}
          onSelectPlace={handleSelectPlace}
        />
        {isFallback && (
          <View className="flex-row items-center gap-1.5 self-start rounded-full bg-surface/95 px-3 py-1.5 shadow-sm">
            <Ionicons
              name="location-outline"
              size={13}
              color={COLORS.textMutedColor}
            />
            <Text
              className="text-[11px] text-textMutedColor"
              style={{ fontFamily: FONTS.medium }}
            >
              Localização padrão (São Paulo)
            </Text>
          </View>
        )}
      </View>

      <View
        className="absolute left-4"
        style={{ bottom: 148 }}
        pointerEvents="box-none"
      >
        <RiskLegend />
      </View>

      <TouchableOpacity
        className="absolute right-4 h-12 w-12 items-center justify-center rounded-full bg-surface shadow-lg"
        style={{ bottom: 148 }}
        onPress={handleRecenter}
        activeOpacity={0.85}
        disabled={recentering}
        accessibilityLabel="Recalibrar minha localização"
      >
        {recentering ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="locate" size={22} color={COLORS.primary} />
        )}
      </TouchableOpacity>

      {error && !loading && (
        <View className="absolute inset-x-4 top-1/2 items-center rounded-2xl bg-surface p-4 shadow-lg">
          <Ionicons
            name="cloud-offline-outline"
            size={28}
            color={COLORS.error}
          />
          <Text
            className="mt-2 text-center text-[14px] text-textColor"
            style={{ fontFamily: FONTS.medium }}
          >
            {error}
          </Text>
          <TouchableOpacity
            className="mt-3 rounded-full bg-primary px-4 py-2"
            onPress={() => loadRisk(center, scope)}
            activeOpacity={0.85}
          >
            <Text
              className="text-[13px] text-white"
              style={{ fontFamily: FONTS.semibold }}
            >
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <NearbyZonesSheet
        zones={grid}
        loading={loading}
        onSelectZone={handleSelectZone}
      />
    </View>
  );
}

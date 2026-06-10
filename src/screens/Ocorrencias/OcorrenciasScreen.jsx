import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import ScreenHeader from "../../components/ui/ScreenHeader";
import RiskBadge from "../../components/ui/RiskBadge";
import StatusPill from "../../components/ui/StatusPill";
import FAB from "../../components/ui/FAB";
import { fetchIncidents } from "../../services/api/incidents";
import { RISK_LEVELS } from "../../services/risk";
import { INCIDENT_TYPES } from "../../constants/incidents";
import { COLORS, FONTS } from "../../constants/theme";
import { formatRelativeTime } from "../../utils/format";

export default function OcorrenciasScreen({ navigation }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("todos");

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      (async () => {
        try {
          const list = await fetchIncidents();
          if (active) setIncidents(list);
        } catch {
          if (active) setIncidents([]);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return incidents.filter((i) => {
      const matchesType = activeType === "todos" || i.type === activeType;
      const matchesQuery =
        !term ||
        i.title.toLowerCase().includes(term) ||
        i.neighborhood.toLowerCase().includes(term);
      return matchesType && matchesQuery;
    });
  }, [incidents, query, activeType]);

  function openDetail(incident) {
    navigation.navigate("DetalheOcorrencia", { incident });
  }

  function openMap() {
    navigation.getParent()?.navigate("Mapa");
  }

  function openRegister() {
    navigation.navigate("RegistrarOcorrencia");
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-background">
        <ScreenHeader title="Ocorrências" />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-28 gap-3"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="gap-3 pb-1 pt-3">
              <SearchBar value={query} onChangeText={setQuery} />
              <TypeChips active={activeType} onChange={setActiveType} />
              <Text
                className="text-[13px] text-textMutedColor"
                style={{ fontFamily: FONTS.medium }}
              >
                Próximas a você ·{" "}
                {loading
                  ? "carregando…"
                  : `${filtered.length} ${
                      filtered.length === 1 ? "resultado" : "resultados"
                    }`}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <IncidentCard incident={item} onPress={() => openDetail(item)} />
          )}
          ListEmptyComponent={
            loading ? (
              <View className="items-center py-16">
                <ActivityIndicator color={COLORS.primary} />
              </View>
            ) : (
              <View className="items-center py-16">
                <Ionicons
                  name="search-outline"
                  size={28}
                  color={COLORS.outlineColor}
                />
                <Text
                  className="mt-2 text-[14px] text-textMutedColor"
                  style={{ fontFamily: FONTS.regular }}
                >
                  Nenhuma ocorrência encontrada.
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            !loading && filtered.length > 0 ? (
              <MapPreview incidents={filtered} onExpand={openMap} />
            ) : null
          }
        />

        <FAB icon="notifications" color={COLORS.error} onPress={openRegister} />
      </View>
    </SafeAreaView>
  );
}

function SearchBar({ value, onChangeText }) {
  return (
    <View className="flex-row items-center gap-2 rounded-2xl bg-surface px-3.5 shadow-sm">
      <Ionicons name="options-outline" size={18} color={COLORS.outlineColor} />
      <TextInput
        className="flex-1 py-3 text-[15px] text-textColor"
        style={{ fontFamily: FONTS.regular }}
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar por tipo ou local..."
        placeholderTextColor={COLORS.outlineColor}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons name="close-circle" size={18} color={COLORS.outlineColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function TypeChips({ active, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pr-2"
    >
      {INCIDENT_TYPES.map((t) => {
        const isActive = active === t.key;
        return (
          <TouchableOpacity
            key={t.key}
            className={`rounded-full px-4 py-2 ${isActive ? "bg-primary" : "bg-surface"}`}
            style={
              isActive
                ? null
                : { borderWidth: 1, borderColor: COLORS.borderColor }
            }
            onPress={() => onChange(t.key)}
            activeOpacity={0.8}
          >
            <Text
              className={`text-[13px] ${isActive ? "text-white" : "text-textMutedColor"}`}
              style={{ fontFamily: isActive ? FONTS.bold : FONTS.medium }}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function IncidentCard({ incident, onPress }) {
  return (
    <TouchableOpacity
      className="overflow-hidden rounded-2xl bg-surface shadow-sm"
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View className="flex-row items-start p-4">
        <View className="flex-1 gap-2">
          <View className="flex-row items-center justify-between">
            <RiskBadge level={incident.riskLevel} />
            <Text
              className="text-[12px] text-textMutedColor"
              style={{ fontFamily: FONTS.regular }}
            >
              {formatRelativeTime(incident.createdAt)}
            </Text>
          </View>

          <Text
            className="text-[16px] text-textColor"
            style={{ fontFamily: FONTS.semibold }}
          >
            {incident.title}
          </Text>

          <View className="flex-row items-center gap-1">
            <Ionicons name="location" size={14} color={COLORS.textMutedColor} />
            <Text
              className="text-[13px] text-textMutedColor"
              style={{ fontFamily: FONTS.regular }}
            >
              {incident.neighborhood}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.outlineColor}
          style={{ marginLeft: 8, marginTop: 2 }}
        />
      </View>

      <StatusPill status={incident.status} variant="bar" />
    </TouchableOpacity>
  );
}

function MapPreview({ incidents, onExpand }) {
  const center = incidents[0];
  return (
    <View className="mt-3 overflow-hidden rounded-2xl bg-surface shadow-sm">
      <View className="relative">
        <MapView
          style={{ height: 160, width: "100%" }}
          pointerEvents="none"
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          initialRegion={{
            latitude: center.latitude,
            longitude: center.longitude,
            latitudeDelta: 0.12,
            longitudeDelta: 0.12,
          }}
        >
          {incidents.map((i) => (
            <Marker
              key={i.id}
              coordinate={{ latitude: i.latitude, longitude: i.longitude }}
              pinColor={RISK_LEVELS[i.riskLevel]?.color}
            />
          ))}
        </MapView>

        <TouchableOpacity
          className="absolute right-3 top-3 flex-row items-center gap-1 rounded-full bg-surface px-3 py-1.5 shadow-md"
          onPress={onExpand}
          activeOpacity={0.85}
        >
          <Ionicons name="expand-outline" size={14} color={COLORS.primary} />
          <Text
            className="text-[12px] text-primary"
            style={{ fontFamily: FONTS.semibold }}
          >
            Expandir
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 py-3">
        <Text
          className="text-[13px] text-textMutedColor"
          style={{ fontFamily: FONTS.regular }}
        >
          {incidents.length}{" "}
          {incidents.length === 1 ? "ocorrência" : "ocorrências"} no mapa
        </Text>
      </View>
    </View>
  );
}

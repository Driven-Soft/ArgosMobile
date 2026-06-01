import { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import ScreenContainer from "../../components/ui/ScreenContainer";
import ScreenHeader from "../../components/ui/ScreenHeader";
import FilterChips from "../../components/ui/FilterChips";
import AlertCard from "../../components/ui/AlertCard";
import FAB from "../../components/ui/FAB";
import { fetchAlerts } from "../../services/api/alerts";
import { COLORS, FONTS } from "../../constants/theme";

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "ativos", label: "Ativos" },
  { key: "criticos", label: "Críticos" },
];

export default function AlertasScreen({ navigation }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("todos");

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const list = await fetchAlerts();
        if (active) {
          setAlerts(list);
          setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (activeFilter === "ativos") return a.active;
      if (activeFilter === "criticos") return a.riskLevel === "critico";
      return true;
    });
  }, [alerts, activeFilter]);

  function openDetail(alert) {
    navigation.navigate("DetalheAlerta", { alertId: alert.id });
  }

  function handleEmitAlert() {
    Alert.alert(
      "Emitir alerta",
      "A emissão de alertas é restrita a agentes da Defesa Civil.",
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Alertas" />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-28 gap-3"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-3 pb-1 pt-3">
            <FilterChips
              filters={FILTERS}
              active={activeFilter}
              onChange={setActiveFilter}
            />
            <Text
              className="text-[13px] text-textMutedColor"
              style={{ fontFamily: FONTS.medium }}
            >
              Monitoramento em tempo real ·{" "}
              {loading
                ? "carregando…"
                : `${filtered.length} ${
                    filtered.length === 1 ? "alerta" : "alertas"
                  }`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <AlertCard alert={item} onPress={() => openDetail(item)} />
        )}
        ListEmptyComponent={
          loading ? (
            <View className="items-center py-16">
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : (
            <View className="items-center py-16">
              <Ionicons
                name="shield-checkmark-outline"
                size={28}
                color={COLORS.outlineColor}
              />
              <Text
                className="mt-2 text-[14px] text-textMutedColor"
                style={{ fontFamily: FONTS.regular }}
              >
                Nenhum alerta nesta categoria.
              </Text>
            </View>
          )
        }
      />

      <FAB icon="warning" color={COLORS.error} onPress={handleEmitAlert} />
    </ScreenContainer>
  );
}

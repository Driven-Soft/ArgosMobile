import { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, FONTS } from "../../constants/theme";

const COLLAPSED_HEIGHT = 132;
const EXPANDED_HEIGHT = 420;

export default function NearbyZonesSheet({ zones, loading, onSelectZone }) {
  const [expanded, setExpanded] = useState(false);
  const height = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

  function toggle() {
    const next = expanded ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT;
    Animated.timing(height, {
      toValue: next,
      duration: 240,
      useNativeDriver: false,
    }).start();
    setExpanded((v) => !v);
  }

  // Zonas ordenadas do maior para o menor risco.
  const sorted = [...zones].sort((a, b) => b.risk.score - a.risk.score);

  return (
    <Animated.View
      style={{ height }}
      className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface shadow-2xl"
    >
      <TouchableOpacity
        className="items-center pt-2.5 pb-1"
        onPress={toggle}
        activeOpacity={0.7}
      >
        <View className="h-1 w-10 rounded-full bg-borderColor" />
      </TouchableOpacity>

      <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
        <View>
          <Text
            className="text-[17px] text-textColor"
            style={{ fontFamily: FONTS.bold }}
          >
            Zonas Próximas
          </Text>
          <Text
            className="text-[12px] text-textMutedColor"
            style={{ fontFamily: FONTS.regular }}
          >
            {loading
              ? "Calculando risco…"
              : `${sorted.length} zonas monitoradas`}
          </Text>
        </View>
        <TouchableOpacity onPress={toggle} activeOpacity={0.7}>
          <Ionicons
            name={expanded ? "chevron-down" : "chevron-up"}
            size={22}
            color={COLORS.textMutedColor}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center pb-6">
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          className="px-4"
          contentContainerClassName="pb-6 gap-2.5"
          showsVerticalScrollIndicator={false}
          scrollEnabled={expanded}
        >
          {sorted.map((zone, index) => (
            <ZoneRow
              key={`${zone.latitude}-${zone.longitude}`}
              zone={zone}
              index={index}
              onPress={() => onSelectZone(zone)}
            />
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
}

function ZoneRow({ zone, index, onPress }) {
  const { risk } = zone;
  const label = `Zona ${String.fromCharCode(65 + (index % 26))}${index + 1}`;
  return (
    <TouchableOpacity
      className="flex-row items-center rounded-2xl border-l-4 bg-surfaceVariant px-3.5 py-3"
      style={{ borderLeftColor: risk.cor }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text
            className="text-[15px] text-textColor"
            style={{ fontFamily: FONTS.semibold }}
          >
            {label}
          </Text>
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: risk.cor + "22" }}
          >
            <Text
              className="text-[10px] uppercase"
              style={{ fontFamily: FONTS.bold, color: risk.cor }}
            >
              {risk.label}
            </Text>
          </View>
        </View>
        <Text
          className="mt-0.5 text-[12px] text-textMutedColor"
          style={{ fontFamily: FONTS.regular }}
        >
          {risk.message} · {Math.round(zone.precip24h)}mm/24h
        </Text>
      </View>
      <View className="items-end">
        <Text
          className="text-[16px]"
          style={{ fontFamily: FONTS.bold, color: risk.cor }}
        >
          {Math.round(risk.score * 100)}%
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={COLORS.outlineColor}
        />
      </View>
    </TouchableOpacity>
  );
}

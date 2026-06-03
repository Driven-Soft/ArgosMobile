import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import ScreenHeader from "../../components/ui/ScreenHeader";
import RiskBadge from "../../components/ui/RiskBadge";
import DetailRow from "../../components/ui/DetailRow";
import RecommendationCard from "../../components/ui/RecommendationCard";
import { RISK_LEVELS } from "../../services/risk";
import { COLORS, FONTS } from "../../constants/theme";
import {
  RECOMMENDATIONS,
  EMERGENCY_CONTACTS,
  formatDateTime,
} from "../../constants/alerts";

export default function DetalheAlertaScreen({ route, navigation }) {
  const { alert } = route.params;
  const risk = RISK_LEVELS[alert.riskLevel] ?? RISK_LEVELS.baixo;

  function openFullMap() {
    navigation.getParent()?.navigate("Mapa");
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Detalhes do alerta"
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6 px-4 pb-10 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-2">
            <RiskBadge level={alert.riskLevel} />
            <Text
              className="text-3xl leading-9 text-textColor"
              style={{ fontFamily: FONTS.bold }}
            >
              {alert.title}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Ionicons
                name="location"
                size={16}
                color={COLORS.textMutedColor}
              />
              <Text
                className="flex-1 text-[14px] text-textMutedColor"
                style={{ fontFamily: FONTS.regular }}
              >
                {alert.location}
              </Text>
            </View>
          </View>

          <View
            className="gap-3 rounded-xl p-4"
            style={{ backgroundColor: COLORS.surfaceVariant }}
          >
            <DetailRow label="Zona" value={alert.zone} />
            <DetailRow label="Autor" value={alert.author} />
            <View className="h-px bg-borderColor/50" />
            <View className="flex-row items-start gap-2">
              <Ionicons
                name="time-outline"
                size={18}
                color={COLORS.primary}
                style={{ marginTop: 1 }}
              />
              <View className="flex-1">
                <Text
                  className="text-[13px] text-textMutedColor"
                  style={{ fontFamily: FONTS.medium }}
                >
                  Período de vigência
                </Text>
                <Text
                  className="mt-0.5 text-[15px] text-textColor"
                  style={{ fontFamily: FONTS.semibold }}
                >
                  {alert.validUntil
                    ? `Válido até ${formatDateTime(alert.validUntil)}`
                    : "Vigência não informada"}
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-3">
            <View className="overflow-hidden rounded-xl">
              <MapView
                style={{ height: 180, width: "100%" }}
                pointerEvents="none"
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                initialRegion={{
                  latitude: alert.latitude,
                  longitude: alert.longitude,
                  latitudeDelta: 0.04,
                  longitudeDelta: 0.04,
                }}
              >
                <Circle
                  center={{
                    latitude: alert.latitude,
                    longitude: alert.longitude,
                  }}
                  radius={900}
                  strokeWidth={1.5}
                  strokeColor={risk.color}
                  fillColor={risk.color + "33"}
                />
                <Marker
                  coordinate={{
                    latitude: alert.latitude,
                    longitude: alert.longitude,
                  }}
                  pinColor={risk.color}
                />
              </MapView>
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 rounded-xl border-[1.5px] border-primary py-3"
              onPress={openFullMap}
              activeOpacity={0.85}
            >
              <Ionicons name="map" size={18} color={COLORS.primary} />
              <Text
                className="text-[14px] text-primary"
                style={{ fontFamily: FONTS.semibold }}
              >
                Ver no mapa completo
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-2">
            <Text
              className="text-[16px] text-textColor"
              style={{ fontFamily: FONTS.bold }}
            >
              Descrição da Situação
            </Text>
            <View className="flex-row gap-3">
              <View
                className="w-1 rounded-full"
                style={{ backgroundColor: risk.color }}
              />
              <Text
                className="flex-1 text-[14px] leading-6 text-textMutedColor"
                style={{ fontFamily: FONTS.regular }}
              >
                {alert.description}
              </Text>
            </View>
          </View>

          <View
            className="gap-3 rounded-xl p-4"
            style={{ backgroundColor: risk.color + "12" }}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="shield-checkmark" size={18} color={risk.color} />
              <Text
                className="text-[16px] text-textColor"
                style={{ fontFamily: FONTS.bold }}
              >
                Recomendações de Segurança
              </Text>
            </View>

            {RECOMMENDATIONS.map((rec) => (
              <RecommendationCard
                key={rec.icon}
                icon={rec.icon}
                text={rec.text}
                color={risk.color}
              />
            ))}

            <RecommendationCard
              icon="call"
              text={EMERGENCY_CONTACTS}
              color={COLORS.riskCritical}
              emphasis
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

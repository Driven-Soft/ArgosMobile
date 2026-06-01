import { View, Text, Image, ImageBackground, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenContainer from "../components/ui/ScreenContainer";
import FeatureCard from "../components/ui/FeatureCard";
import { COLORS, FONTS } from "../constants/theme";

export default function InicioScreen({ navigation }) {
  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-14"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../../assets/images/agua.png")}
          resizeMode="cover"
          className="overflow-hidden rounded-b-[32px]"
          style={{ backgroundColor: COLORS.primary }}
        >
          <View
            className="px-6 pb-12 pt-10"
            style={{ backgroundColor: COLORS.primary + "C0" }}
          >
            <View className="self-start rounded-full bg-white/20 px-3 py-1">
              <Text
                className="text-[11px] uppercase tracking-wider text-white"
                style={{ fontFamily: FONTS.semibold }}
              >
                Segurança Comunitária
              </Text>
            </View>
            <Text
              className="mt-4 text-[30px] leading-9 text-white"
              style={{ fontFamily: FONTS.bold }}
            >
              Proteção inteligente para sua comunidade
            </Text>
            <Text
              className="mt-3 text-[15px] leading-6 text-white/90"
              style={{ fontFamily: FONTS.regular }}
            >
              O Argos monitora riscos de inundação e deslizamento em tempo real,
              conectando você à Defesa Civil quando cada minuto conta.
            </Text>
          </View>
        </ImageBackground>

        <View className="-mt-7 flex-row gap-3 px-6">
          <StatCard
            icon="flash"
            color={COLORS.riskHigh}
            value="Tempo real"
            label="Dados de satélite"
          />
          <StatCard
            icon="time"
            color={COLORS.primary}
            value="24 / 7"
            label="Monitoramento"
          />
          <StatCard
            icon="shield-checkmark"
            color={COLORS.riskLow}
            value="Defesa Civil"
            label="Resposta direta"
          />
        </View>

        <View className="items-center px-6 pt-8">
          <Image
            source={require("../../assets/images/ArgosLogoTitle.png")}
            className="h-10 w-44"
            resizeMode="contain"
          />
          <Text
            className="mt-3 text-center text-[14px] leading-6 text-textMutedColor"
            style={{ fontFamily: FONTS.regular }}
          >
            Tecnologia de monitoramento que une cidadãos e autoridades para
            salvar vidas. Conheça os pilares do app:
          </Text>
        </View>

        <View className="gap-3 px-6 pt-6">
          <Text
            className="text-xl text-textColor"
            style={{ fontFamily: FONTS.bold }}
          >
            Como o Argos protege você
          </Text>

          <FeatureCard
            icon="globe-outline"
            color={COLORS.primary}
            title="Monitoramento Satelital"
            description="Dados meteorológicos e de solo em tempo real para antecipar inundações e deslizamentos."
          />
          <FeatureCard
            icon="map-outline"
            color={COLORS.riskHigh}
            title="Mapa de Risco"
            description="Visualize as zonas de risco da sua região com pinos por tipo e nível de gravidade."
            onPress={() => navigation.navigate("Mapa")}
          />
          <FeatureCard
            icon="notifications-outline"
            color={COLORS.riskCritical}
            title="Alertas em Tempo Real"
            description="Receba avisos imediatos da Defesa Civil sobre situações críticas perto de você."
            onPress={() => navigation.navigate("Alertas")}
          />
          <FeatureCard
            icon="people-outline"
            color={COLORS.riskLow}
            title="Colaboração Comunitária"
            description="Registre ocorrências com geolocalização e acompanhe a resposta junto da sua comunidade."
            onPress={() => navigation.navigate("Ocorrencias")}
          />
        </View>

        <View className="px-6 pt-9">
          <View className="overflow-hidden rounded-3xl bg-surface shadow-sm">
            <ImageBackground
              source={require("../../assets/images/resgate.png")}
              resizeMode="cover"
              style={{ height: 160, backgroundColor: COLORS.surfaceVariant }}
            >
              <View
                className="flex-1 justify-end p-4"
                style={{ backgroundColor: COLORS.primary + "55" }}
              >
                <Text
                  className="text-[20px] text-white"
                  style={{ fontFamily: FONTS.bold }}
                >
                  Mais fortes juntos
                </Text>
              </View>
            </ImageBackground>
            <View className="gap-2 p-4">
              <Text
                className="text-[14px] leading-6 text-textMutedColor"
                style={{ fontFamily: FONTS.regular }}
              >
                Cada ocorrência que você registra ajuda a Defesa Civil a agir
                mais rápido e a proteger toda a vizinhança. Sua participação faz
                a diferença na prevenção de tragédias.
              </Text>
              <View className="flex-row items-center gap-1.5 pt-1">
                <Ionicons name="heart" size={15} color={COLORS.riskCritical} />
                <Text
                  className="text-[13px] text-textColor"
                  style={{ fontFamily: FONTS.semibold }}
                >
                  Feito por e para a comunidade
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chamada final */}
        <View className="items-center px-8 pt-8">
          <Ionicons
            name="arrow-up-circle-outline"
            size={22}
            color={COLORS.primary}
          />
          <Text
            className="mt-2 text-center text-[13px] leading-6 text-textMutedColor"
            style={{ fontFamily: FONTS.regular }}
          >
            Toque em um dos recursos acima para começar a explorar o Argos e
            manter você e sua comunidade em segurança.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function StatCard({ icon, color, value, label }) {
  return (
    <View className="flex-1 items-center gap-1 rounded-2xl bg-surface px-2 py-3 shadow-sm">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: color + "1f" }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text
        className="text-center text-[13px] text-textColor"
        style={{ fontFamily: FONTS.bold }}
      >
        {value}
      </Text>
      <Text
        className="text-center text-[10px] leading-[13px] text-textMutedColor"
        style={{ fontFamily: FONTS.regular }}
      >
        {label}
      </Text>
    </View>
  );
}

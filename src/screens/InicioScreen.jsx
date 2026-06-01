import { View, Text, Image, ScrollView } from "react-native";

import ScreenContainer from "../components/ui/ScreenContainer";
import FeatureCard from "../components/ui/FeatureCard";
import { COLORS, FONTS } from "../constants/theme";

const argosLogo = require("../../assets/images/ArgosLogo.png");
const argosLogoTitle = require("../../assets/images/ArgosLogoTitle.png");

export default function InicioScreen({ navigation }) {
  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-6 pb-12 gap-7"
        showsVerticalScrollIndicator={false}
      >
        {/* Identidade — logo centralizado em destaque */}
        <View className="items-center gap-3 pt-4">
          <Image
            source={argosLogoTitle}
            className="h-20 w-60 my-8"
            resizeMode="contain"
          />
          <Text
            className="px-2 text-center text-[15px] leading-6 text-textMutedColor pb-6"
            style={{ fontFamily: FONTS.regular }}
          >
            Proteção inteligente para sua comunidade. Conheça como o Argos ajuda
            a prevenir riscos de inundação e deslizamento.
          </Text>
        </View>

        <View className="gap-3">
          <Text
            className="text-xl text-textColor pb-2"
            style={{ fontFamily: FONTS.bold }}
          >
            Como o Argos protege você:
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

        <Text
            className="px-2 text-center text-sm leading-6 text-textMutedColor pt-4"
            style={{ fontFamily: FONTS.regular }}
          >
            Clique nos recursos acima para explorar o aplicativo e descobrir como o Argos pode ajudar a manter você e sua comunidade seguros.
          </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

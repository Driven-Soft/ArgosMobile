import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const argosLogo = require("../../assets/images/ArgosLogo.png");
const argosLogoTitle = require("../../assets/images/ArgosLogoTitle.png");

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 px-6 bg-background">
      <View className="items-center pt-5">
        <Image
          source={argosLogo}
          className="w-14 h-14 opacity-10"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 justify-center items-center px-2 gap-4">
        <Image
          source={argosLogoTitle}
          className="w-40 h-10 mb-2"
          resizeMode="contain"
        />
        <Text className="text-[32px] text-center leading-[42px] font-bold text-textColor">
          {"Proteção inteligente\npara sua comunidade"}
        </Text>
        <Text className="text-base text-center leading-6 font-regular text-textMutedColor">
          O Argos utiliza dados em tempo real para monitorar riscos de inundação
          e deslizamentos, conectando cidadãos e Defesa Civil para salvar vidas.
        </Text>
      </View>

      <View className="pb-5 gap-3">
        <TouchableOpacity
          className="rounded-[14px] py-[17px] items-center shadow-md bg-primary"
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.85}
        >
          <Text className="text-base tracking-wide font-semibold text-white">
            Cadastre-se
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border-[1.5px] border-primary rounded-[14px] py-[17px] items-center"
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.85}
        >
          <Text className="text-base tracking-wide font-semibold text-primary">
            Já tenho uma conta
          </Text>
        </TouchableOpacity>

        <Text className="text-xs text-center mt-1 leading-[18px] font-regular text-textMutedColor">
          Ao continuar, você concorda com os nossos{" "}
          <Text className="text-primary underline">Termos de Serviço</Text> e{" "}
          <Text className="text-primary underline">
            Política de Privacidade
          </Text>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
}

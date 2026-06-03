import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PrimaryButton from "../components/ui/PrimaryButton";
import { USER_KEY, SESSION_KEY } from "../services/session";

export default function WelcomeScreen({ navigation }) {
  function handleClearData() {
    Alert.alert(
      "Limpar dados do app",
      "Isso remove o cadastro e a sessão salvos neste dispositivo. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove([USER_KEY, SESSION_KEY]);
            Alert.alert(
              "Dados removidos",
              "Você já pode criar um novo cadastro.",
            );
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1 px-6 bg-background">
      <View className="items-center pt-5">
        <Image
          source={require("../../assets/images/ArgosLogo.png")}
          className="w-14 h-14 opacity-10"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 justify-center items-center px-2 gap-4">
        <Image
          source={require("../../assets/images/ArgosLogoTitle.png")}
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
        <PrimaryButton
          title="Cadastre-se"
          onPress={() => navigation.navigate("Register")}
        />

        <PrimaryButton
          title="Já tenho uma conta"
          variant="outline"
          onPress={() => navigation.navigate("Login")}
        />

        <Text className="text-xs text-center mt-1 leading-[18px] font-regular text-textMutedColor">
          Ao continuar, você concorda com os nossos{" "}
          <Text className="text-primary underline">Termos de Serviço</Text> e{" "}
          <Text className="text-primary underline">
            Política de Privacidade
          </Text>
          .
        </Text>

        <TouchableOpacity
          className="items-center pt-1"
          onPress={handleClearData}
          activeOpacity={0.6}
        >
          <Text className="text-xs font-medium text-textMutedColor underline">
            Limpar dados do app
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

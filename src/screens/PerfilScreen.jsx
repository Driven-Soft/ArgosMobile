import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ScreenContainer from "../components/ui/ScreenContainer";
import { COLORS, FONTS } from "../constants/theme";

export default function PerfilScreen({ navigation }) {
  async function handleLogout() {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("@argos:session");
          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: "Welcome" }],
          });
        },
      },
    ]);
  }

  return (
    <ScreenContainer className="justify-between">
      <View className="flex-1 items-center justify-center">
        <Text
          className="text-2xl"
          style={{ fontFamily: FONTS.semibold, color: COLORS.textColor }}
        >
          Perfil screen
        </Text>
      </View>

      <View className="px-6 pb-6">
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 py-4 rounded-2xl border-[1.5px]"
          style={{
            borderColor: COLORS.error + "40",
            backgroundColor: COLORS.error + "0d",
          }}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text
            className="text-base"
            style={{ fontFamily: FONTS.semibold, color: COLORS.error }}
          >
            Sair da conta
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

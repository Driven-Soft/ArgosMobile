import { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ScreenContainer from "../components/ui/ScreenContainer";
import ContactCard from "../components/ui/ContactCard";
import { COLORS, FONTS } from "../constants/theme";

const MENU_ITEMS = [
  {
    id: "edit",
    icon: "create-outline",
    label: "Editar Perfil",
  },
  {
    id: "alerts",
    icon: "notifications-outline",
    label: "Histórico de Alertas",
  },
  { id: "history", icon: "time-outline", label: "Histórico de Ocorrências" },
];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function PerfilScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const raw = await AsyncStorage.getItem("@argos:user");
        if (active) setUser(raw ? JSON.parse(raw) : null);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  function handleMenuPress(item) {
    if (item.id === "edit") {
      navigation.navigate("EditarPerfil");
      return;
    }
    if (item.id === "alerts") {
      navigation.navigate("Alertas");
      return;
    }
    if (item.id === "history") {
      navigation.navigate("Ocorrencias");
      return;
    }
    Alert.alert("Em breve", "Esta funcionalidade estará disponível em breve.");
  }

  function handleLogout() {
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
    <ScreenContainer>
      <View className="flex-row items-center justify-between border-b border-borderColor/50 bg-surface px-4 py-3 shadow-sm">
        <Image
          source={require("../../assets/images/ArgosLogo.png")}
          className="h-8 w-8"
          resizeMode="contain"
        />
        <Text
          className="text-[18px]"
          style={{ fontFamily: FONTS.bold, color: COLORS.primary }}
        >
          Argos
        </Text>
        <View className="h-8 w-8" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8 pt-4 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-3 rounded-3xl bg-surface px-6 py-7 shadow-sm">
          <View
            className="h-24 w-24 items-center justify-center rounded-full border-2"
            style={{
              borderColor: COLORS.primary,
              backgroundColor: COLORS.primaryContainer,
            }}
          >
            <Text
              className="text-[32px]"
              style={{ fontFamily: FONTS.bold, color: COLORS.primary }}
            >
              {getInitials(user?.name)}
            </Text>
          </View>

          <Text
            className="text-xl"
            style={{ fontFamily: FONTS.bold, color: COLORS.textColor }}
          >
            {user?.name ?? "Visitante"}
          </Text>

          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: COLORS.surfaceVariant }}
          >
            <Text
              className="text-[11px] uppercase tracking-wider"
              style={{ fontFamily: FONTS.semibold, color: COLORS.primary }}
            >
              Cidadão
            </Text>
          </View>
        </View>
        <View className="gap-3">
          <ContactCard
            icon="mail-outline"
            label="Email"
            value={user?.email ?? "Não informado"}
          />
          <ContactCard
            icon="call-outline"
            label="Telefone"
            value={user?.phone ?? "Não informado"}
          />
        </View>

        <View className="overflow-hidden rounded-2xl bg-surface shadow-sm">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center gap-4 px-4 py-4 ${
                index < MENU_ITEMS.length - 1
                  ? "border-b border-borderColor/40"
                  : ""
              }`}
              activeOpacity={0.6}
              onPress={() => handleMenuPress(item)}
            >
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: COLORS.surfaceVariant }}
              >
                <Ionicons name={item.icon} size={20} color={COLORS.primary} />
              </View>
              <Text
                className="flex-1 text-[15px]"
                style={{ fontFamily: FONTS.medium, color: COLORS.textColor }}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.outlineColor}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="mt-1 flex-row items-center justify-center gap-2 rounded-2xl py-4"
          style={{ backgroundColor: COLORS.error + "1a" }}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text
            className="text-[14px] uppercase tracking-wider"
            style={{ fontFamily: FONTS.bold, color: COLORS.error }}
          >
            Sair da conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

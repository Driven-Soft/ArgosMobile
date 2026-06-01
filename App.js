import "react-native-gesture-handler";
import "./global.css";

import { useEffect, useState } from "react";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import {
  useFonts,
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
} from "@expo-google-fonts/public-sans";
import AsyncStorage from "@react-native-async-storage/async-storage";

import StackRoutes from "./src/routes/stack.routes";
import { COLORS } from "./src/constants/theme";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const [fontsLoaded] = useFonts({
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
  });

  useEffect(() => {
    async function checkAuth() {
      const session = await AsyncStorage.getItem("@argos:session");
      setIsAuthenticated(!!session);
    }
    checkAuth();
  }, []);

  if (!fontsLoaded || isAuthenticated === null) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar hidden />
        <StackRoutes isAuthenticated={isAuthenticated} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

import "react-native-gesture-handler";

import "./global.css";

import StackRoutes from "./src/routes/stack.routes";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar hidden />
        <StackRoutes />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

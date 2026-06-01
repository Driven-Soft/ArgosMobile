import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

import HomeScreen from "../screens/InicioScreen";
import MapaScreen from "../screens/MapaScreen";
import OcorrenciasRoutes from "../routes/ocorrencias.routes";
import AlertasScreen from "../screens/Alertas/AlertasScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Inicio":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Mapa":
              iconName = focused ? "map" : "map-outline";
              break;
            case "Alertas":
              iconName = focused ? "notifications" : "notifications-outline";
              break;
            case "Ocorrencias":
              iconName = focused ? "warning" : "warning-outline";
              break;
            case "Perfil":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMutedColor,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.borderColor,
          elevation: 5,
          shadowOpacity: 0.1,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Alertas" component={AlertasScreen} />
      <Tab.Screen name="Ocorrencias" component={OcorrenciasRoutes} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

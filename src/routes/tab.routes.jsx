import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/InicioScreen";
import MapaScreen from "../screens/MapaScreen";
import OcorrenciasScreen from "../screens/Ocorrencias/OcorrenciasScreen";
import AlertasScreen from "../screens/Alertas/AlertasScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Alertas" component={AlertasScreen} />
      <Tab.Screen name="Ocorrencias" component={OcorrenciasScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
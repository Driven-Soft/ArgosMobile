import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AlertasScreen from "../screens/Alertas/AlertasScreen";
import DetalheAlertaScreen from "../screens/Alertas/DetalheAlertaScreen";

const Stack = createNativeStackNavigator();

export default function AlertasRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="AlertasFeed"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AlertasFeed" component={AlertasScreen} />
      <Stack.Screen name="DetalheAlerta" component={DetalheAlertaScreen} />
    </Stack.Navigator>
  );
}

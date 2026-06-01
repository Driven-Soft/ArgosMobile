import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OcorrenciasScreen from "../screens/Ocorrencias/OcorrenciasScreen";
import DetalheOcorrenciaScreen from "../screens/Ocorrencias/DetalheOcorrenciaScreen";
import RegistrarOcorrenciaScreen from "../screens/Ocorrencias/RegistrarOcorrenciaScreen";

const Stack = createNativeStackNavigator();

export default function OcorrenciasRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="OcorrenciasFeed"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="OcorrenciasFeed" component={OcorrenciasScreen} />
      <Stack.Screen
        name="DetalheOcorrencia"
        component={DetalheOcorrenciaScreen}
      />
      <Stack.Screen
        name="RegistrarOcorrencia"
        component={RegistrarOcorrenciaScreen}
      />
    </Stack.Navigator>
  );
}

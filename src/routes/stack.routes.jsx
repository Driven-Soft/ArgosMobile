import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Tabs from "./tab.routes";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import EditarPerfilScreen from "../screens/EditarPerfilScreen";

const Stack = createNativeStackNavigator();

export default function StackRoutes({ isAuthenticated }) {
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Tabs" : "Welcome"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
    </Stack.Navigator>
  );
}

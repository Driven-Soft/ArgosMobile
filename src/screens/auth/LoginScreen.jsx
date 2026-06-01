import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "E-mail é obrigatório.";
    if (!password) next.password = "Senha é obrigatória.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem("@argos:user");
      if (!raw) {
        Alert.alert("Conta não encontrada", "Cadastre-se primeiro.");
        return;
      }
      const user = JSON.parse(raw);
      if (
        user.email !== email.trim().toLowerCase() ||
        user.password !== password
      ) {
        Alert.alert("Credenciais inválidas", "E-mail ou senha incorretos.");
        return;
      }
      await AsyncStorage.setItem("@argos:session", "true");
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch {
      Alert.alert("Erro", "Não foi possível fazer o login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1 px-6 pb-8"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          className="flex-row items-center gap-1.5 pt-2 self-start"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          <Text className="text-[15px] font-medium text-primary">Voltar</Text>
        </TouchableOpacity>

        <View className="mt-6 mb-8 gap-2">
          <Text className="text-[30px] leading-[38px] font-bold text-textColor">
            Bem-vindo de volta
          </Text>
          <Text className="text-[15px] leading-[22px] font-regular text-textMutedColor">
            Entre com sua conta Argos.
          </Text>
        </View>

        <View className="gap-5 mb-8">
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-textColor">E-mail</Text>
            <View
              className={`flex-row items-center border-[1.5px] rounded-xl px-3.5 ${errors.email ? "border-error" : "border-borderColor"} bg-surface`}
            >
              <TextInput
                className="flex-1 py-3.5 text-[15px] font-regular text-textColor"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors((p) => ({ ...p, email: null }));
                }}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.outlineColor}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text className="text-xs font-regular text-error">
                {errors.email}
              </Text>
            )}
          </View>

          <View className="gap-1.5">
            <Text className="text-sm font-medium text-textColor">Senha</Text>
            <View
              className={`flex-row items-center border-[1.5px] rounded-xl px-3.5 ${errors.password ? "border-error" : "border-borderColor"} bg-surface`}
            >
              <TextInput
                className="flex-1 py-3.5 text-[15px] font-regular text-textColor"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: null }));
                }}
                placeholder="Sua senha"
                placeholderTextColor={COLORS.outlineColor}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="pl-2"
                onPress={() => setShowPassword((v) => !v)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.outlineColor}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-xs font-regular text-error">
                {errors.password}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          className={`rounded-[14px] py-[17px] items-center shadow-md bg-primary ${loading ? "opacity-70" : ""}`}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-base tracking-wide font-semibold text-white">
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center mt-5"
          onPress={() => navigation.navigate("Register")}
        >
          <Text className="text-sm font-regular text-textMutedColor">
            Não tem uma conta?{" "}
            <Text className="font-semibold text-primary">Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

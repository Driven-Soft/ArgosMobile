import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/theme";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Nome é obrigatório.";
    if (!form.email.trim()) next.email = "E-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "E-mail inválido.";
    if (!form.password) next.password = "Senha é obrigatória.";
    else if (form.password.length < 6)
      next.password = "A senha deve ter pelo menos 6 caracteres.";
    if (!form.confirmPassword) next.confirmPassword = "Confirme sua senha.";
    else if (form.password !== form.confirmPassword)
      next.confirmPassword = "As senhas não coincidem.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem("@argos:user", JSON.stringify(user));
      await AsyncStorage.setItem("@argos:session", "true");
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch {
      Alert.alert("Erro", "Não foi possível salvar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
              Criar conta
            </Text>
            <Text className="text-[15px] leading-[22px] font-regular text-textMutedColor">
              Junte-se à rede de monitoramento comunitário.
            </Text>
          </View>

          <View className="gap-5 mb-8">
            <Field
              label="Nome completo"
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
              placeholder="Seu nome"
              autoCapitalize="words"
              error={errors.name}
            />
            <Field
              label="E-mail"
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Field
              label="Senha"
              value={form.password}
              onChangeText={(v) => updateField("password", v)}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry={!showPassword}
              error={errors.password}
              trailing={
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.outlineColor}
                  />
                </TouchableOpacity>
              }
            />
            <Field
              label="Confirmar senha"
              value={form.confirmPassword}
              onChangeText={(v) => updateField("confirmPassword", v)}
              placeholder="Repita a senha"
              secureTextEntry={!showConfirmPassword}
              error={errors.confirmPassword}
              trailing={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((v) => !v)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color={COLORS.outlineColor}
                  />
                </TouchableOpacity>
              }
            />
          </View>

          <TouchableOpacity
            className={`rounded-[14px] py-[17px] items-center shadow-md bg-primary ${loading ? "opacity-70" : ""}`}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-base tracking-wide font-semibold text-white">
                Criar conta
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center mt-5"
            onPress={() => navigation.navigate("Login")}
          >
            <Text className="text-sm font-regular text-textMutedColor">
              Já tem uma conta?{" "}
              <Text className="font-semibold text-primary">Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, error, trailing, ...inputProps }) {
  const hasError = !!error;
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-textColor">{label}</Text>
      <View
        className={`flex-row items-center border-[1.5px] rounded-xl px-3.5 ${hasError ? "border-error" : "border-borderColor"} bg-surface`}
      >
        <TextInput
          className="flex-1 py-3.5 text-[15px] font-regular text-textColor"
          placeholderTextColor={COLORS.outlineColor}
          {...inputProps}
        />
        {trailing && <View className="pl-2">{trailing}</View>}
      </View>
      {hasError && (
        <Text className="text-xs font-regular text-error">{error}</Text>
      )}
    </View>
  );
}

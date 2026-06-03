import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../../components/ui/PrimaryButton";
import TextField from "../../components/ui/TextField";
import { findUserByEmail } from "../../services/api/users";
import { getStoredUser, saveSession } from "../../services/session";
import { COLORS } from "../../constants/theme";
import { maskEmail, isValidEmail } from "../../utils/masks";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "E-mail é obrigatório.";
    else if (!isValidEmail(email)) next.email = "E-mail inválido.";
    if (!password) next.password = "Senha é obrigatória.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function enterAs(user) {
    await saveSession(user);
    navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      // Busca a conta no servidor pelo e-mail (não há rota de login — §3).
      // A senha não pode ser verificada no servidor (a API nunca a devolve).
      const remote = await findUserByEmail(email);
      if (!remote) {
        Alert.alert(
          "Conta não encontrada",
          "Verifique o e-mail ou cadastre-se.",
        );
        return;
      }
      await enterAs({
        id: remote.id,
        name: remote.nome,
        email: remote.email,
        phone: remote.telefone ?? "",
        tipoUsuario: remote.tipoUsuario,
        createdAt: remote.dataCriacao,
      });
    } catch (err) {
      // Servidor indisponível: tenta a conta salva neste aparelho (offline).
      const local = await getStoredUser();
      if (
        local &&
        local.email === email.trim().toLowerCase() &&
        local.password === password
      ) {
        await enterAs(local);
        return;
      }
      Alert.alert("Erro ao entrar", err.message ?? "Tente novamente.");
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
          <TextField
            label="E-mail"
            value={email}
            onChangeText={(v) => {
              setEmail(maskEmail(v));
              if (errors.email) setErrors((p) => ({ ...p, email: null }));
            }}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <TextField
            label="Senha"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (errors.password) setErrors((p) => ({ ...p, password: null }));
            }}
            placeholder="Sua senha"
            secureTextEntry
            error={errors.password}
          />
        </View>

        <PrimaryButton title="Entrar" onPress={handleLogin} loading={loading} />

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

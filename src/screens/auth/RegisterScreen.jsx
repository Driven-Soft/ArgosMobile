import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../../components/ui/PrimaryButton";
import TextField from "../../components/ui/TextField";
import { createUser } from "../../services/api/users";
import { saveSession } from "../../services/session";
import { COLORS } from "../../constants/theme";
import {
  maskName,
  maskEmail,
  maskPhone,
  onlyDigits,
  isValidEmail,
  isValidPhone,
} from "../../utils/masks";

const MASKS = {
  name: maskName,
  email: maskEmail,
  phone: maskPhone,
};

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    const masked = MASKS[field] ? MASKS[field](value) : value;
    setForm((prev) => ({ ...prev, [field]: masked }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Nome é obrigatório.";
    else if (form.name.trim().split(/\s+/).length < 2)
      next.name = "Informe nome e sobrenome.";
    if (!form.email.trim()) next.email = "E-mail é obrigatório.";
    else if (!isValidEmail(form.email)) next.email = "E-mail inválido.";
    if (!form.phone.trim()) next.phone = "Telefone é obrigatório.";
    else if (!isValidPhone(form.phone)) next.phone = "Telefone inválido.";
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
      // Cadastra na API e guarda o `id` retornado como credencial do app (§3).
      const created = await createUser({
        nome: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        senha: form.password,
        telefone: onlyDigits(form.phone),
        tipoUsuario: "CIDADAO",
      });

      // Mantemos a senha localmente porque o login é validado no app (a API
      // não devolve nem valida senha — ARGOS-API-PARA-MOBILE.md §3).
      const user = {
        id: created.id,
        name: created.nome,
        email: created.email,
        phone: form.phone.trim(),
        password: form.password,
        tipoUsuario: created.tipoUsuario,
        createdAt: created.dataCriacao,
      };
      await saveSession(user);
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch (err) {
      Alert.alert(
        "Não foi possível criar a conta",
        err.message ?? "Tente novamente.",
      );
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
            <TextField
              label="Nome completo"
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
              placeholder="Seu nome"
              autoCapitalize="words"
              error={errors.name}
            />
            <TextField
              label="E-mail"
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <TextField
              label="Telefone"
              value={form.phone}
              onChangeText={(v) => updateField("phone", v)}
              placeholder="(11) 90000-0000"
              keyboardType="phone-pad"
              maxLength={15}
              error={errors.phone}
            />
            <TextField
              label="Senha"
              value={form.password}
              onChangeText={(v) => updateField("password", v)}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              error={errors.password}
            />
            <TextField
              label="Confirmar senha"
              value={form.confirmPassword}
              onChangeText={(v) => updateField("confirmPassword", v)}
              placeholder="Repita a senha"
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>

          <PrimaryButton
            title="Criar conta"
            onPress={handleRegister}
            loading={loading}
          />

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

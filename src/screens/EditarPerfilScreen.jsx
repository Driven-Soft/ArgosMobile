import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "../components/ui/ScreenHeader";
import PrimaryButton from "../components/ui/PrimaryButton";
import TextField from "../components/ui/TextField";
import { updateUser } from "../services/api/users";
import { getStoredUser, saveSession } from "../services/session";
import { COLORS } from "../constants/theme";
import { maskName, maskPhone, onlyDigits, isValidPhone } from "../utils/masks";

const MASKS = {
  name: maskName,
  phone: maskPhone,
};

export default function EditarPerfilScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await getStoredUser();
      if (active) {
        setUser(stored);
        setForm({
          name: stored?.name ?? "",
          phone: maskPhone(stored?.phone ?? ""),
          password: "",
        });
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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
    if (!form.phone.trim()) next.phone = "Telefone é obrigatório.";
    else if (!isValidPhone(form.phone)) next.phone = "Telefone inválido.";
    if (form.password && form.password.length < 6)
      next.password = "A senha deve ter pelo menos 6 caracteres.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (!validate() || !user) return;
    setSaving(true);
    try {
      const novaSenha = form.password || user.password;
      const updated = await updateUser(user.id, {
        nome: form.name.trim(),
        senha: novaSenha,
        telefone: onlyDigits(form.phone),
        tipoUsuario: user.tipoUsuario ?? "CIDADAO",
        ativo: true,
      });

      const merged = {
        ...user,
        name: updated.nome ?? form.name.trim(),
        phone: form.phone.trim(),
        password: novaSenha,
        tipoUsuario: updated.tipoUsuario ?? user.tipoUsuario,
      };
      await saveSession(merged);

      Alert.alert("Perfil atualizado", "Suas informações foram salvas.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Não foi possível salvar", err.message ?? "Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Editar perfil"
          onBack={() => navigation.goBack()}
        />

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : (
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              className="flex-1"
              contentContainerClassName="px-5 py-6 gap-5"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <TextField
                label="Nome completo"
                value={form.name}
                onChangeText={(v) => updateField("name", v)}
                placeholder="Seu nome"
                autoCapitalize="words"
                error={errors.name}
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
                label="Nova senha"
                value={form.password}
                onChangeText={(v) => updateField("password", v)}
                placeholder="Deixe em branco para manter"
                secureTextEntry
                error={errors.password}
              />

              <View className="mt-1">
                <PrimaryButton
                  title="Salvar alterações"
                  onPress={handleSave}
                  loading={saving}
                />
              </View>

              <TouchableOpacity
                className="items-center"
                onPress={() => navigation.goBack()}
                disabled={saving}
              >
                <Text className="text-sm font-regular text-textMutedColor">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaView>
  );
}

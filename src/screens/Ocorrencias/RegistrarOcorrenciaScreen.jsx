import { useEffect, useState } from "react";
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
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import ScreenHeader from "../../components/ui/ScreenHeader";
import { createIncident } from "../../services/api/incidents";
import { getCurrentLocation } from "../../services/location";
import { INCIDENT_TYPES } from "../../constants/incidents";
import { COLORS, FONTS } from "../../constants/theme";

const TYPE_OPTIONS = INCIDENT_TYPES.filter((t) => t.key !== "todos");

export default function RegistrarOcorrenciaScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(null);
  const [description, setDescription] = useState("");
  const [coordinate, setCoordinate] = useState(null);
  const [locating, setLocating] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;
    (async () => {
      const loc = await getCurrentLocation();
      if (active) {
        setCoordinate({ latitude: loc.latitude, longitude: loc.longitude });
        setLocating(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  function clearError(field) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  }

  function validate() {
    const next = {};
    if (!title.trim()) next.title = "Informe um título.";
    if (!type) next.type = "Selecione o tipo de risco.";
    if (!description.trim()) next.description = "Descreva a ocorrência.";
    if (!coordinate) next.coordinate = "Defina a localização no mapa.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createIncident({
        title: title.trim(),
        type,
        description: description.trim(),
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
      Alert.alert("Ocorrência registrada", "Obrigado por contribuir!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Erro", "Não foi possível registrar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Registrar ocorrência"
          onBack={() => navigation.goBack()}
        />

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-5 py-5 gap-5 pb-10"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Field label="Título" error={errors.title}>
              <TextInput
                className="rounded-xl border-[1.5px] bg-surface px-3.5 py-3 text-[15px] text-textColor"
                style={{
                  fontFamily: FONTS.regular,
                  borderColor: errors.title ? COLORS.error : COLORS.borderColor,
                }}
                value={title}
                onChangeText={(v) => {
                  setTitle(v);
                  clearError("title");
                }}
                placeholder="Ex: Rua alagada na esquina"
                placeholderTextColor={COLORS.outlineColor}
              />
            </Field>

            <Field label="Tipo de risco" error={errors.type}>
              <TypeDropdown
                value={type}
                hasError={!!errors.type}
                onChange={(v) => {
                  setType(v);
                  clearError("type");
                }}
              />
            </Field>

            <Field label="Descrição" error={errors.description}>
              <TextInput
                className="rounded-xl border-[1.5px] bg-surface px-3.5 py-3 text-[15px] text-textColor"
                style={{
                  fontFamily: FONTS.regular,
                  borderColor: errors.description
                    ? COLORS.error
                    : COLORS.borderColor,
                  minHeight: 96,
                  textAlignVertical: "top",
                }}
                value={description}
                onChangeText={(v) => {
                  setDescription(v);
                  clearError("description");
                }}
                placeholder="Descreva o que está acontecendo..."
                placeholderTextColor={COLORS.outlineColor}
                multiline
              />
            </Field>

            <Field label="Localização" error={errors.coordinate}>
              <Text
                className="text-[12px] text-textMutedColor"
                style={{ fontFamily: FONTS.regular }}
              >
                Toque no mapa ou arraste o pino para ajustar.
              </Text>
              <View className="mt-2 overflow-hidden rounded-xl">
                {locating || !coordinate ? (
                  <View
                    className="items-center justify-center bg-surfaceVariant"
                    style={{ height: 220 }}
                  >
                    <ActivityIndicator color={COLORS.primary} />
                    <Text
                      className="mt-2 text-[12px] text-textMutedColor"
                      style={{ fontFamily: FONTS.regular }}
                    >
                      Obtendo sua localização...
                    </Text>
                  </View>
                ) : (
                  <MapView
                    style={{ height: 220, width: "100%" }}
                    initialRegion={{
                      ...coordinate,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    onPress={(e) => {
                      setCoordinate(e.nativeEvent.coordinate);
                      clearError("coordinate");
                    }}
                  >
                    <Marker
                      coordinate={coordinate}
                      draggable
                      onDragEnd={(e) => setCoordinate(e.nativeEvent.coordinate)}
                      pinColor={COLORS.primary}
                    />
                  </MapView>
                )}
              </View>
              {coordinate && (
                <Text
                  className="mt-1.5 text-[11px] text-textMutedColor"
                  style={{ fontFamily: FONTS.regular }}
                >
                  {coordinate.latitude.toFixed(5)},{" "}
                  {coordinate.longitude.toFixed(5)}
                </Text>
              )}
            </Field>

            <TouchableOpacity
              className={`mt-1 items-center rounded-[14px] bg-primary py-[17px] shadow-md ${
                submitting ? "opacity-70" : ""
              }`}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text
                  className="text-base tracking-wide text-white"
                  style={{ fontFamily: FONTS.semibold }}
                >
                  Registrar ocorrência
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function Field({ label, error, children }) {
  return (
    <View className="gap-1.5">
      <Text
        className="text-sm text-textColor"
        style={{ fontFamily: FONTS.medium }}
      >
        {label}
      </Text>
      {children}
      {error && (
        <Text
          className="text-xs text-error"
          style={{ fontFamily: FONTS.regular }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

function TypeDropdown({ value, hasError, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = TYPE_OPTIONS.find((t) => t.key === value);

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center justify-between rounded-xl border-[1.5px] bg-surface px-3.5 py-3"
        style={{ borderColor: hasError ? COLORS.error : COLORS.borderColor }}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <Text
          className="text-[15px]"
          style={{
            fontFamily: FONTS.regular,
            color: selected ? COLORS.textColor : COLORS.outlineColor,
          }}
        >
          {selected ? selected.label : "Selecione o tipo"}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={COLORS.outlineColor}
        />
      </TouchableOpacity>

      {open && (
        <View className="mt-1.5 overflow-hidden rounded-xl border border-borderColor bg-surface">
          {TYPE_OPTIONS.map((t, i) => (
            <TouchableOpacity
              key={t.key}
              className={`px-3.5 py-3 ${i > 0 ? "border-t border-borderColor/40" : ""}`}
              onPress={() => {
                onChange(t.key);
                setOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                className="text-[15px]"
                style={{
                  fontFamily: value === t.key ? FONTS.semibold : FONTS.regular,
                  color: value === t.key ? COLORS.primary : COLORS.textColor,
                }}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

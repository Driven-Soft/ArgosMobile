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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import { fetchComments } from "../../services/api/incidents";
import { RISK_LEVELS } from "../../services/risk";
import { INCIDENT_STATUS } from "../../constants/incidents";
import { COLORS, FONTS } from "../../constants/theme";
import { formatRelativeTime, formatDistance } from "../../utils/format";

export default function DetalheOcorrenciaScreen({ route, navigation }) {
  const { incident } = route.params;
  const risk = RISK_LEVELS[incident.riskLevel] ?? RISK_LEVELS.baixo;
  const status = INCIDENT_STATUS[incident.status] ?? INCIDENT_STATUS.em_analise;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const list = await fetchComments(incident.id);
      if (active) {
        setComments(list);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [incident.id]);

  function sendComment() {
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        author: "Você",
        role: "cidadao",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }

  function openFullMap() {
    navigation.getParent()?.navigate("Mapa");
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-background">
        <View className="flex-row items-center gap-3 border-b border-borderColor/50 bg-surface px-4 py-3 shadow-sm">
          <TouchableOpacity
            className="h-9 w-9 items-center justify-center"
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textColor} />
          </TouchableOpacity>
          <Text
            className="flex-1 text-[17px]"
            style={{ fontFamily: FONTS.bold, color: COLORS.textColor }}
            numberOfLines={1}
          >
            Detalhes da ocorrência
          </Text>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="pb-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <MapView
              style={{ height: 180, width: "100%" }}
              pointerEvents="none"
              scrollEnabled={false}
              zoomEnabled={false}
              initialRegion={{
                latitude: incident.latitude,
                longitude: incident.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              <Marker
                coordinate={{
                  latitude: incident.latitude,
                  longitude: incident.longitude,
                }}
                pinColor={risk.color}
              />
            </MapView>

            <View className="gap-4 px-5 pt-4">
              <View className="flex-row items-center justify-between">
                <View
                  className="rounded-md px-2.5 py-1"
                  style={{ backgroundColor: risk.color }}
                >
                  <Text
                    className="text-[10px] uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.bold }}
                  >
                    {risk.label}
                  </Text>
                </View>
                <Text
                  className="text-[12px] text-textMutedColor"
                  style={{ fontFamily: FONTS.regular }}
                >
                  {formatRelativeTime(incident.createdAt)}
                </Text>
              </View>

              <View className="gap-1.5">
                <Text
                  className="text-[22px] leading-7 text-textColor"
                  style={{ fontFamily: FONTS.bold }}
                >
                  {incident.title}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons
                    name="location"
                    size={15}
                    color={COLORS.textMutedColor}
                  />
                  <Text
                    className="text-[13px] text-textMutedColor"
                    style={{ fontFamily: FONTS.regular }}
                  >
                    {incident.neighborhood}
                    {incident.distance
                      ? `, ${formatDistance(incident.distance)}`
                      : ""}
                  </Text>
                </View>
              </View>

              <View
                className="flex-row items-center gap-2 self-start rounded-full px-3 py-1.5"
                style={{ backgroundColor: status.color + "1f" }}
              >
                <View
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <Text
                  className="text-[12px]"
                  style={{ fontFamily: FONTS.semibold, color: status.color }}
                >
                  {status.label}
                </Text>
              </View>

              <Section title="Descrição">
                <Text
                  className="text-[14px] leading-5 text-textMutedColor"
                  style={{ fontFamily: FONTS.regular }}
                >
                  {incident.description}
                </Text>
              </Section>

              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 rounded-xl border-[1.5px] border-primary py-3"
                onPress={openFullMap}
                activeOpacity={0.85}
              >
                <Ionicons name="map" size={18} color={COLORS.primary} />
                <Text
                  className="text-[14px] text-primary"
                  style={{ fontFamily: FONTS.semibold }}
                >
                  Ver no mapa completo
                </Text>
              </TouchableOpacity>

              <Section title="Atualizações">
                {loading ? (
                  <ActivityIndicator color={COLORS.primary} className="py-4" />
                ) : comments.length === 0 ? (
                  <Text
                    className="text-[13px] text-textMutedColor"
                    style={{ fontFamily: FONTS.regular }}
                  >
                    Nenhuma atualização ainda.
                  </Text>
                ) : (
                  <View className="gap-2.5">
                    {comments.map((c) => (
                      <CommentBubble key={c.id} comment={c} />
                    ))}
                  </View>
                )}
              </Section>
            </View>
          </ScrollView>

          <View className="flex-row items-center gap-2 border-t border-borderColor/50 bg-surface px-4 py-2.5">
            <TextInput
              className="flex-1 rounded-full bg-surfaceVariant px-4 py-2.5 text-[14px] text-textColor"
              style={{ fontFamily: FONTS.regular }}
              value={draft}
              onChangeText={setDraft}
              placeholder="Adicionar uma atualização..."
              placeholderTextColor={COLORS.outlineColor}
              returnKeyType="send"
              onSubmitEditing={sendComment}
            />
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full bg-primary"
              onPress={sendComment}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View className="gap-2">
      <Text
        className="text-[13px] uppercase tracking-wide text-textMutedColor"
        style={{ fontFamily: FONTS.semibold }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function CommentBubble({ comment }) {
  const isAuthority = comment.role === "defesa_civil";
  return (
    <View
      className="rounded-2xl px-3.5 py-2.5"
      style={{
        backgroundColor: isAuthority
          ? COLORS.primaryContainer
          : COLORS.surfaceVariant,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          {isAuthority && (
            <Ionicons
              name="shield-checkmark"
              size={13}
              color={COLORS.primary}
            />
          )}
          <Text
            className="text-[12px]"
            style={{
              fontFamily: FONTS.semibold,
              color: isAuthority ? COLORS.primary : COLORS.textColor,
            }}
          >
            {comment.author}
          </Text>
        </View>
        <Text
          className="text-[11px] text-textMutedColor"
          style={{ fontFamily: FONTS.regular }}
        >
          {formatRelativeTime(comment.createdAt)}
        </Text>
      </View>
      <Text
        className="mt-1 text-[14px] leading-5 text-textColor"
        style={{ fontFamily: FONTS.regular }}
      >
        {comment.text}
      </Text>
    </View>
  );
}

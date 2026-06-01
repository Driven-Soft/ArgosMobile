import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { geocode } from "../../services/api/openMeteo";
import { COLORS, FONTS } from "../../constants/theme";

const SCOPES = [
  { key: "cidade", label: "Cidade" },
  { key: "estado", label: "Estado" },
];

export default function MapSearchBar({ scope, onScopeChange, onSelectPlace }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounce = useRef(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (query.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const places = await geocode(query);
        setResults(places);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 450);
    return () => debounce.current && clearTimeout(debounce.current);
  }, [query]);

  function handleSelect(place) {
    setOpen(false);
    setQuery(place.name);
    onSelectPlace(place);
  }

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2 rounded-2xl bg-surface px-3.5 shadow-md">
        <Ionicons name="search" size={18} color={COLORS.outlineColor} />
        <TextInput
          className="flex-1 py-3 text-[15px] text-textColor"
          style={{ fontFamily: FONTS.regular }}
          value={query}
          onChangeText={setQuery}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Buscar cidade ou endereço"
          placeholderTextColor={COLORS.outlineColor}
          returnKeyType="search"
          autoCapitalize="words"
        />
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : query.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
          >
            <Ionicons name="close-circle" size={18} color={COLORS.outlineColor} />
          </TouchableOpacity>
        ) : null}
      </View>

      {open && results.length > 0 && (
        <View className="overflow-hidden rounded-2xl bg-surface shadow-md">
          <FlatList
            data={results}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => (
              <View className="h-px bg-borderColor/40" />
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center gap-2.5 px-3.5 py-3"
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <View className="flex-1">
                  <Text
                    className="text-[14px] text-textColor"
                    style={{ fontFamily: FONTS.medium }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className="text-[12px] text-textMutedColor"
                    style={{ fontFamily: FONTS.regular }}
                    numberOfLines={1}
                  >
                    {[item.admin1, item.country].filter(Boolean).join(", ")}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View className="flex-row gap-2">
        {SCOPES.map((s) => {
          const active = scope === s.key;
          return (
            <TouchableOpacity
              key={s.key}
              className={`flex-row items-center gap-1.5 rounded-full px-3.5 py-2 shadow-sm ${
                active ? "bg-primary" : "bg-surface"
              }`}
              onPress={() => onScopeChange(s.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={s.key === "cidade" ? "business-outline" : "map-outline"}
                size={14}
                color={active ? "#ffffff" : COLORS.textMutedColor}
              />
              <Text
                className={`text-[12px] ${active ? "text-white" : "text-textMutedColor"}`}
                style={{ fontFamily: FONTS.semibold }}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

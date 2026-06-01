import { Text, TouchableOpacity, ScrollView } from "react-native";

import { COLORS, FONTS } from "../../constants/theme";

export default function FilterChips({ filters, active, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pr-2"
    >
      {filters.map((f) => {
        const isActive = active === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            className={`rounded-full px-4 py-2 ${isActive ? "bg-primary" : "bg-surface"}`}
            style={
              isActive
                ? null
                : { borderWidth: 1, borderColor: COLORS.borderColor }
            }
            onPress={() => onChange(f.key)}
            activeOpacity={0.8}
          >
            <Text
              className={`text-[13px] ${isActive ? "text-white" : "text-textMutedColor"}`}
              style={{ fontFamily: isActive ? FONTS.bold : FONTS.medium }}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, FONTS } from "../../constants/theme";

export default function ContactCard({ icon, label, value }) {
  return (
    <View className="flex-row items-center gap-4 rounded-2xl bg-surface px-4 py-4 shadow-sm">
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: COLORS.primaryContainer }}
      >
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View className="flex-1">
        <Text
          className="text-[12px]"
          style={{ fontFamily: FONTS.medium, color: COLORS.textMutedColor }}
        >
          {label}
        </Text>
        <Text
          className="mt-0.5 text-[15px]"
          style={{ fontFamily: FONTS.semibold, color: COLORS.textColor }}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants/theme";

export default function FeatureCard({ icon, color, title, description, onPress }) {
  const interactive = typeof onPress === "function";

  return (
    <TouchableOpacity
      className="flex-row items-center gap-4 rounded-2xl bg-surface p-4 shadow-sm"
      onPress={onPress}
      activeOpacity={interactive ? 0.85 : 1}
      disabled={!interactive}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Ionicons name={icon} size={24} color="#ffffff" />
      </View>

      <View className="flex-1 gap-1">
        <Text
          className="text-[15px] text-textColor"
          style={{ fontFamily: FONTS.semibold }}
        >
          {title}
        </Text>
        <Text
          className="text-[13px] leading-5 text-textMutedColor"
          style={{ fontFamily: FONTS.regular }}
        >
          {description}
        </Text>
      </View>

      {interactive && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.outlineColor}
        />
      )}
    </TouchableOpacity>
  );
}

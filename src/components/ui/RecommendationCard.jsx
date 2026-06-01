import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FONTS } from "../../constants/theme";

export default function RecommendationCard({
  icon,
  text,
  color,
  emphasis = false,
}) {
  return (
    <View className="flex-row items-center gap-3 rounded-xl bg-surface p-3 shadow-sm">
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: color + "1f" }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text
        className="flex-1 text-[14px] leading-5 text-textColor"
        style={{ fontFamily: emphasis ? FONTS.bold : FONTS.regular }}
      >
        {text}
      </Text>
    </View>
  );
}

import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/theme";

export default function FAB({
  icon,
  onPress,
  color = COLORS.primary,
  iconSize = 26,
}) {
  return (
    <TouchableOpacity
      className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full shadow-lg"
      style={{ backgroundColor: color }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={iconSize} color="#ffffff" />
    </TouchableOpacity>
  );
}

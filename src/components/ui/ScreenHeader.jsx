import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, FONTS } from "../../constants/theme";

export default function ScreenHeader({ title, onBack, trailing }) {
  const canGoBack = typeof onBack === "function";

  return (
    <View className="border-b border-borderColor/50 bg-surface px-4 py-4 shadow-sm">
      {canGoBack && (
        <TouchableOpacity
          className="absolute inset-y-0 left-2 z-10 w-10 items-center justify-center"
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textColor} />
        </TouchableOpacity>
      )}
      <Text
        className={`text-center text-[18px] ${canGoBack || trailing ? "px-10" : ""}`}
        style={{ fontFamily: FONTS.bold, color: COLORS.primary }}
        numberOfLines={1}
      >
        {title}
      </Text>
      {trailing && (
        <View className="absolute inset-y-0 right-2 z-10 items-center justify-center">
          {trailing}
        </View>
      )}
    </View>
  );
}

import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { COLORS } from "../../constants/theme";

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}) {
  const isOutline = variant === "outline";
  const inactive = loading || disabled;

  return (
    <TouchableOpacity
      className={`items-center rounded-[14px] py-[17px] ${
        isOutline ? "border-[1.5px] border-primary" : "bg-primary shadow-md"
      } ${inactive ? "opacity-70" : ""}`}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={inactive}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : "#ffffff"} />
      ) : (
        <Text
          className={`text-base tracking-wide font-semibold ${
            isOutline ? "text-primary" : "text-white"
          }`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

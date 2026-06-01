import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/theme";

export default function TextField({
  label,
  error,
  secureTextEntry = false,
  trailing,
  ...inputProps
}) {
  const [hidden, setHidden] = useState(secureTextEntry);
  const hasError = !!error;

  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-textColor">{label}</Text>
      )}
      <View
        className={`flex-row items-center rounded-xl border-[1.5px] px-3.5 ${
          hasError ? "border-error" : "border-borderColor"
        } bg-surface`}
      >
        <TextInput
          className="flex-1 py-3.5 text-[15px] font-regular text-textColor"
          placeholderTextColor={COLORS.outlineColor}
          secureTextEntry={hidden}
          {...inputProps}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            className="pl-2"
            onPress={() => setHidden((v) => !v)}
          >
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={COLORS.outlineColor}
            />
          </TouchableOpacity>
        ) : (
          trailing && <View className="pl-2">{trailing}</View>
        )}
      </View>
      {hasError && (
        <Text className="text-xs font-regular text-error">{error}</Text>
      )}
    </View>
  );
}

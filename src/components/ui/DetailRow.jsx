import { View, Text } from "react-native";

import { FONTS } from "../../constants/theme";

export default function DetailRow({ label, value }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text
        className="text-[13px] text-textMutedColor"
        style={{ fontFamily: FONTS.medium }}
      >
        {label}
      </Text>
      <Text
        className="text-[14px] text-textColor"
        style={{ fontFamily: FONTS.semibold }}
      >
        {value}
      </Text>
    </View>
  );
}

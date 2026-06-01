import { View, Text } from "react-native";

import { RISK_SCALE } from "../../services/risk";
import { FONTS } from "../../constants/theme";

export default function RiskLegend() {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl bg-surface/95 px-3.5 py-2.5 shadow-md">
      {RISK_SCALE.map((level) => (
        <View key={level.key} className="flex-row items-center gap-1.5">
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: level.color }}
          />
          <Text
            className="text-[11px] text-textMutedColor"
            style={{ fontFamily: FONTS.medium }}
          >
            {level.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

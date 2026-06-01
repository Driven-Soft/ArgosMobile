import { View, Text } from "react-native";

import { RISK_LEVELS } from "../../services/risk";

export default function RiskBadge({ level }) {
  const risk = RISK_LEVELS[level] ?? RISK_LEVELS.baixo;

  return (
    <View
      className="self-start rounded-md px-2.5 py-1"
      style={{ backgroundColor: risk.color }}
    >
      <Text className="text-[10px] font-bold uppercase tracking-wide text-white">
        {risk.label}
      </Text>
    </View>
  );
}

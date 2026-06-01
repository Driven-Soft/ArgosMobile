import { View, Text } from "react-native";

import { INCIDENT_STATUS } from "../../constants/incidents";

export default function StatusPill({ status, variant = "pill" }) {
  const s = INCIDENT_STATUS[status] ?? INCIDENT_STATUS.em_analise;
  const isBar = variant === "bar";

  return (
    <View
      className={`flex-row items-center gap-2 ${
        isBar ? "px-4 py-2.5" : "self-start rounded-full px-3 py-1.5"
      }`}
      style={{ backgroundColor: s.color + (isBar ? "14" : "1f") }}
    >
      <View
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: s.color }}
      />
      <Text
        className={`text-[12px] ${isBar ? "font-medium" : "font-semibold"}`}
        style={{ color: s.color }}
      >
        {s.label}
      </Text>
    </View>
  );
}

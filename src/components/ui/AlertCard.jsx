import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import RiskBadge from "./RiskBadge";
import { COLORS, FONTS } from "../../constants/theme";
import { formatRelativeTime } from "../../utils/format";

export default function AlertCard({ alert, onPress }) {
  const status = alert.active
    ? { color: COLORS.riskLow, label: "Ativo" }
    : { color: COLORS.outlineColor, label: "Encerrado" };

  return (
    <TouchableOpacity
      className="overflow-hidden rounded-2xl bg-surface shadow-sm"
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View className="flex-row items-start p-4">
        <View className="flex-1 gap-2">
          <View className="flex-row items-center justify-between">
            <RiskBadge level={alert.riskLevel} />
            <Text
              className="text-[12px] text-textMutedColor"
              style={{ fontFamily: FONTS.regular }}
            >
              {formatRelativeTime(alert.createdAt)}
            </Text>
          </View>

          <Text
            className="text-[16px] text-textColor"
            style={{ fontFamily: FONTS.semibold }}
          >
            {alert.title}
          </Text>

          <View className="flex-row items-center gap-1">
            <Ionicons name="location" size={14} color={COLORS.textMutedColor} />
            <Text
              className="text-[13px] text-textMutedColor"
              style={{ fontFamily: FONTS.regular }}
            >
              {alert.location}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.outlineColor}
          style={{ marginLeft: 8, marginTop: 2 }}
        />
      </View>

      <View
        className="flex-row items-center gap-2 px-4 py-2.5"
        style={{ backgroundColor: status.color + "14" }}
      >
        <View
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: status.color }}
        />
        <Text
          className="text-[12px]"
          style={{ fontFamily: FONTS.medium, color: status.color }}
        >
          {status.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

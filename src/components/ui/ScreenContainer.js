import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScreenContainer({ children, className = '' }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View className={`flex-1 bg-zinc-950 ${className}`.trim()}>
        {children}
      </View>
    </SafeAreaView>
  );
}
import { ColorPickerModal } from "@/components/settings/ColorPickerModal";
import { SettingsButton } from "@/components/settings/SettingsButton";
import { BackgroundColorProvider, useBackgroundColor } from "@/contexts/BackgroundColorContext";
import { useColorPicker } from "@/hooks/useColorPicker";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import 'react-native-reanimated';

function LayoutContent() {
  const { backgroundColor, setBackgroundColor } = useBackgroundColor();
  const { isVisible, openPicker, closePicker } = useColorPicker();

  return (
    <>
      <SettingsButton onPress={openPicker} />
      <ColorPickerModal
        visible={isVisible}
        selectedColor={backgroundColor.color}
        onClose={closePicker}
        onSelectColor={(item) => setBackgroundColor(item)}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BackgroundColorProvider>
          <LayoutContent />
        </BackgroundColorProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

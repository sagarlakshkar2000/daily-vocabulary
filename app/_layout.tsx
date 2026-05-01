import { ColorPickerModal } from "@/components/settings/ColorPickerModal";
import { SettingsButton } from "@/components/settings/SettingsButton";
import { BackgroundColorProvider, useBackgroundColor } from "@/contexts/BackgroundColorContext";
import { useColorPicker } from "@/hooks/useColorPicker";
import { initDB } from "@/src/config/database";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContent } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import 'react-native-reanimated';

function LayoutContent() {
  const { backgroundColor, setBackgroundColor } = useBackgroundColor();
  const { isVisible, openPicker, closePicker } = useColorPicker();

  React.useEffect(() => {
    initDB();
  }, []);

  return (
    <>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: backgroundColor.color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          drawerStyle: {
            backgroundColor: '#fff',
            width: 280,
          },
          drawerActiveTintColor: backgroundColor.color,
          drawerInactiveTintColor: '#8E8E93',
          drawerActiveBackgroundColor: `${backgroundColor.color}50`,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Vocabulary",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="add-vocabulary"
          options={{
            title: "Add Vocabulary",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
        {/* <Drawer.Screen
          name="favorites"
          options={{
            title: "Favorites",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="bookmarks"
          options={{
            title: "Bookmarks",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="bookmark" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            title: "History",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: "Settings",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="test-firebase"
          options={{
            title: "Test Firebase",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="flask" size={size} color={color} />
            ),
          }}
        /> */}
      </Drawer>

      <SettingsButton onPress={openPicker} />
      <ColorPickerModal
        visible={isVisible}
        selectedColor={backgroundColor.color}
        onClose={closePicker}
        onSelectColor={(item) => setBackgroundColor(item)}
      />
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

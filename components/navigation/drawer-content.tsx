import { useBackgroundColor } from "@/contexts/BackgroundColorContext";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";

export function DrawerContent(props: any) {
  const { backgroundColor } = useBackgroundColor();

  return (
    <DrawerContentScrollView {...props}>
      <View style={[styles.header, { backgroundColor: backgroundColor.color }]}>
        <Ionicons name="language" size={40} color="#fff" />
        <Text style={styles.headerTitle}>VocabMaster</Text>
        <Text style={styles.headerSubtitle}>Learn English Vocabulary</Text>
      </View>

      <DrawerItemList {...props} />

      <DrawerItem
        label="Share App"
        icon={({ color, size }) => (
          <Ionicons name="share-social" size={size} color={color} />
        )}
        onPress={() => {
          // Add share functionality
        }}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
});

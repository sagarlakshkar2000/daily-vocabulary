import { StyleSheet } from "react-native";
import { theme } from "../theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },

  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 12,
  },

  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "600",
  },

  text: {
    color: theme.colors.muted,
    fontSize: 14,
  },
});

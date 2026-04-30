// constants/colors.ts
import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Optimized for reading - calm, low contrast, reduced eye strain
export const BG_COLORS = [
  {
    name: "Warm Charcoal",
    color: "#d5c1a2ff",
    description: "Warm, paper-like dark tone"
  },
  {
    name: "Deep Slate",
    color: "#ade1f3ff",
    description: "Calm blue-gray, easy on eyes"
  },
  {
    name: "Soft Midnight",
    color: "#abc9fcff",
    description: "Deep navy, classic reading mode"
  },
  {
    name: "Muted Forest",
    color: "#abf0c0ff",
    description: "Natural green tone, relaxing"
  },
  {
    name: "Gentle Plum",
    color: "#e7b7f4ff",
    description: "Soft purple, unique and calm"
  },
  {
    name: "Warm Espresso",
    color: "#c3a893ff",
    description: "Coffee tone, cozy reading"
  },
  {
    name: "Cool Charcoal",
    color: "#2A2A2E",
    description: "Neutral gray, balanced"
  },
  {
    name: "Deep Teal",
    color: "#c6ededff",
    description: "Ocean depth, very soothing"
  },
] as const;

// Alternative: Even softer backgrounds for extended reading
export const SOFT_BG_COLORS = [
  { name: "Warm Stone", color: "#edd2b2ff" },
  { name: "Dusty Blue", color: "#15e3ffff" },
  { name: "Moss Green", color: "#2A3A2A" },
  { name: "Ash Gray", color: "#3A3A3A" },
  { name: "Deep Burgundy", color: "#3A2A2A" },
  { name: "Midnight Purple", color: "#2A2A3A" },
];

// Text colors optimized for dark backgrounds
export const TEXT_COLORS = {
  primary: "#F0E8E0",    // Warm white for main text
  secondary: "#D4C8B8",  // Softer for secondary text
  accent: "#A8C8E8",     // Soft blue for accents
  muted: "#9E8E7A",      // Muted for hints
  white: "#FFFFFF",
  black: "#000000",
};

// Card background (slightly lighter than main bg for depth)
export const CARD_BG = "rgba(255, 255, 255, 0.08)";
export const CARD_BG_HOVER = "rgba(255, 255, 255, 0.12)";

export const COLOR_OPTION_SIZE = 60;
export const COLOR_OPTIONS_PER_ROW = 4;
export const COLOR_OPTION_WIDTH = (SCREEN_WIDTH - 80) / COLOR_OPTIONS_PER_ROW;

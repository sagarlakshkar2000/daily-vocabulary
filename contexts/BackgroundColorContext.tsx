import { BG_COLORS } from "@/constants/colors";
import { createContext, ReactNode, useContext, useState } from "react";

interface BackgroundColorContextType {
  backgroundColor: { name: string, color: string };
  setBackgroundColor: (item: { name: string, color: string }) => void;
}

const BackgroundColorContext = createContext<BackgroundColorContextType | undefined>(undefined);

export const useBackgroundColor = () => {
  const context = useContext(BackgroundColorContext);
  if (!context) {
    throw new Error("useBackgroundColor must be used within BackgroundColorProvider");
  }
  return context;
};

interface BackgroundColorProviderProps {
  children: ReactNode;
}

export const BackgroundColorProvider: React.FC<BackgroundColorProviderProps> = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState<{ name: string, color: string }>(BG_COLORS[0]);

  const setBgColor = (item: { name: string, color: string }) => {
    setBackgroundColor(item);
  };

  return (
    <BackgroundColorContext.Provider value={{
      backgroundColor,
      setBackgroundColor: setBgColor,
    }}>
      {children}
    </BackgroundColorContext.Provider>
  );
};

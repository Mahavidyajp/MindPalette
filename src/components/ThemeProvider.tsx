
import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeType = "light" | "dark";
export type BackgroundType = "default" | "gradient1" | "gradient2" | "gradient3" | "gradient4";

interface ThemeContextType {
  theme: ThemeType;
  background: BackgroundType;
  setTheme: (theme: ThemeType) => void;
  setBackground: (background: BackgroundType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeType>("light");
  const [background, setBackgroundState] = useState<BackgroundType>("default");

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem("theme") as ThemeType | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
      document.documentElement.classList.add("dark");
    }

    // Initialize background from localStorage
    const savedBackground = localStorage.getItem("background") as BackgroundType | null;
    if (savedBackground) {
      setBackgroundState(savedBackground);
      applyBackgroundClass(savedBackground);
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const setBackground = (newBackground: BackgroundType) => {
    setBackgroundState(newBackground);
    applyBackgroundClass(newBackground);
    localStorage.setItem("background", newBackground);
  };

  const applyBackgroundClass = (bg: BackgroundType) => {
    document.body.classList.remove(
      "bg-default",
      "bg-gradient1",
      "bg-gradient2",
      "bg-gradient3",
      "bg-gradient4"
    );
    document.body.classList.add(`bg-${bg}`);
  };

  return (
    <ThemeContext.Provider value={{ theme, background, setTheme, setBackground }}>
      {children}
    </ThemeContext.Provider>
  );
}

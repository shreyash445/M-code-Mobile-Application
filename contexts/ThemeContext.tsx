import { createContext, useContext, useState, useMemo } from 'react';
import { DARK_THEME, LIGHT_THEME } from '../constants/MorseData';
import type { ThemeColors } from '../constants/MorseData';

type ThemeContextType = {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: DARK_THEME,
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark(prev => !prev);
  const value = useMemo(() => ({
    theme: isDark ? DARK_THEME : LIGHT_THEME,
    isDark,
    toggleTheme,
  }), [isDark]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

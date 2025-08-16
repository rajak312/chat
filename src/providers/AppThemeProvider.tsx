import { createContext, useContext, type ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export type Theme = "dark" | "light" | "system";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeContext = createContext<ThemeContextType | null>(null);

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("AUTH_APP_THEME") as Theme | null;
    return stored || "system";
  });

  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() =>
    theme === "system" ? getSystemTheme() : theme
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      if (theme === "system") {
        setResolvedTheme(media.matches ? "dark" : "light");
      }
    };
    updateSystemTheme(); // run once on mount
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("AUTH_APP_THEME", theme);
    setResolvedTheme(theme === "system" ? getSystemTheme() : theme);
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme,
        },
      }),
    [resolvedTheme]
  );

  return (
    <AppThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context)
    throw new Error("useAppTheme must be used within AppThemeProvider");
  return context;
}

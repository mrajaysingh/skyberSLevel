"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type DashboardTheme = "light" | "dark";

interface DashboardThemeContextType {
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined);

export const useDashboardTheme = () => {
  const context = useContext(DashboardThemeContext);
  if (!context) {
    throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  }
  return context;
};

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  // Default to light to avoid low-contrast text on first paint
  const [theme, setThemeState] = useState<DashboardTheme>("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme") as DashboardTheme;
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeState(savedTheme);
    }
  }, []);

  // Apply/remove the global .dark class so Tailwind CSS variables (bg-background, text-foreground, etc.) work
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    root.setAttribute("data-dashboard-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: DashboardTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("dashboard-theme", newTheme);
    } catch {}
  };

  return (
    <DashboardThemeContext.Provider value={{ theme, setTheme }}>
      <div data-dashboard-theme={theme} className={theme === "dark" ? "dark-dashboard" : "light-dashboard"}>
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}

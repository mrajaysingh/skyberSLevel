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
  const [theme, setThemeState] = useState<DashboardTheme>("dark");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme") as DashboardTheme;
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: DashboardTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("dashboard-theme", newTheme);
  };

  return (
    <DashboardThemeContext.Provider value={{ theme, setTheme }}>
      <div data-dashboard-theme={theme} className={theme === "dark" ? "dark-dashboard" : "light-dashboard"}>
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}


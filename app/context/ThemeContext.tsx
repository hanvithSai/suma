"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Set mounted on client side
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // Handle theme synchronization
  useEffect(() => {
    const savedTheme = localStorage.getItem("suma-theme") as Theme;
    if (savedTheme && savedTheme !== theme) {
      setTimeout(() => setTheme(savedTheme), 0);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches && theme !== "dark") {
      setTimeout(() => setTheme("dark"), 0);
      document.documentElement.setAttribute("data-theme", "dark");
    } else if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("suma-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

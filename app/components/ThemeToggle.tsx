"use client";

import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="glass p-3 rounded-xl w-11 h-11 flex items-center justify-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110"
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
      ) : (
        <Sun className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
      )}
    </button>
  );
}

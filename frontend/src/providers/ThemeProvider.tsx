"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Accent = "blue" | "purple" | "green" | "orange" | "red";

interface ThemeContextType {
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState<Accent>("blue");

  useEffect(() => {
    const savedAccent = localStorage.getItem("coervora-accent") as Accent;
    if (savedAccent) setAccent(savedAccent);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem("coervora-accent", accent);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ accent, setAccent }}>
      {children}
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

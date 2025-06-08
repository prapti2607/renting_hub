"use client"

import type React from "react"
import { createContext, useContext } from "react"

export const colors = {
  primary: "#0ea5e9",
  primaryDark: "#0284c7",
  secondary: "#64748b",
  background: "#ffffff",
  card: "#ffffff",
  text: "#0f172a",
  border: "#e2e8f0",
  notification: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  muted: "#64748b",
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
}

export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
}

export const theme = {
  colors,
  spacing,
  typography,
}

const ThemeContext = createContext(theme)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}


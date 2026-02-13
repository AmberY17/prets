"use client"

import { useState, useEffect } from "react"

const themes = [
  { id: "green", label: "Green", color: "hsl(152 60% 38%)" },
  { id: "blue", label: "Blue", color: "hsl(217 72% 50%)" },
  { id: "indigo", label: "Indigo", color: "hsl(239 60% 55%)" },
] as const

type ThemeId = (typeof themes)[number]["id"]

export function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>("green")

  // Read stored theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("prets-theme") as ThemeId | null
    if (stored && themes.some((t) => t.id === stored)) {
      setActiveTheme(stored)
      document.documentElement.setAttribute("data-theme", stored)
    }
  }, [])

  const handleThemeChange = (themeId: ThemeId) => {
    setActiveTheme(themeId)
    document.documentElement.setAttribute("data-theme", themeId)
    localStorage.setItem("prets-theme", themeId)
  }

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Theme color">
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          role="radio"
          aria-checked={activeTheme === theme.id}
          aria-label={`${theme.label} theme`}
          onClick={() => handleThemeChange(theme.id)}
          className="relative flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span
            className="block h-4 w-4 rounded-full transition-all"
            style={{
              backgroundColor: theme.color,
              boxShadow: activeTheme === theme.id
                ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${theme.color}`
                : "none",
            }}
          />
        </button>
      ))}
    </div>
  )
}

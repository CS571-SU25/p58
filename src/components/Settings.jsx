export function applyTheme(theme) {
  document.body.classList.remove("light-mode", "dark-mode");
  if (theme === "light") {
    document.body.classList.add("light-mode");
  } else if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

export function applyColor(color) {
  document.body.setAttribute("data-color", color);
}

export function applySavedPreferences() {
  const savedTheme = localStorage.getItem("theme");
  const savedColor = localStorage.getItem("color");

  if (savedTheme) applyTheme(savedTheme);
  if (savedColor) applyColor(savedColor);
}

import { useState, useEffect } from "react";

export default function Settings() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [color, setColor] = useState(() => localStorage.getItem("color") || "turquoise");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("color", color);
    applyColor(color);
  }, [color]);

  const themeOptions = ["light", "dark"];
  const colorOptions = [
    { name: "Brown", value: "brown" },
    { name: "Turquoise", value: "turquoise" },
    { name: "Purple", value: "purple" },
    { name: "Orange", value: "orange" },
    { name: "Pink", value: "pink" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "1.5rem" }}>
      <h2 style={{ color: "var(--primary-color)", fontWeight: "bold" }}>Theme</h2>
      <div role="radiogroup" aria-label="Theme Options">
        {themeOptions.map((opt) => (
          <label
            key={opt}
            style={{
              display: "block",
              color: theme === opt ? "var(--primary-color)" : "var(--text-color)",
              marginBottom: "8px",
              cursor: "pointer"
            }}
            aria-label={`${opt.charAt(0).toUpperCase() + opt.slice(1)} Theme`}
          >
            <div
              role="radio"
              aria-checked={theme === opt}
              tabIndex={0}
              onClick={() => setTheme(opt)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") setTheme(opt);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                outline: "none"
              }}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}{" "}
              {theme === opt && <span style={{ color: "var(--primary-color)", marginLeft: 4 }}>✓</span>}
            </div>
          </label>
        ))}
      </div>

      <h2 style={{ color: "var(--primary-color)", fontWeight: "bold", marginTop: "2rem" }}>
        Primary Color
      </h2>
      <div role="radiogroup" aria-label="Primary Color Options">
        {colorOptions.map((opt) => (
          <label
            key={opt.value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              cursor: "pointer",
              color: opt.value,
            }}
            aria-label={`${opt.name} Primary Color`}
          >
            <div
              role="radio"
              aria-checked={color === opt.value}
              tabIndex={0}
              onClick={() => setColor(opt.value)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") setColor(opt.value);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                outline: "none"
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: opt.value,
                  border: "1px solid #444",
                  display: "inline-block",
                  marginRight: "8px"
                }}
              ></span>
              <span style={{ color: opt.value }}>{opt.name}</span>
              {color === opt.value && <span style={{ marginLeft: 4 }}>✓</span>}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
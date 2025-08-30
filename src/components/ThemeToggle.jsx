import React from "react";
import { setTheme as setThemeStorage } from "../utils/storage.js";

export default function ThemeToggle({ theme, setTheme }) {
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);              // update App state
    setThemeStorage(next);       // persist + update document attribute
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button className="btn theme-btn" onClick={toggle}>
      {theme === "light" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}

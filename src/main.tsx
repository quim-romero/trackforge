import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";

const rawTheme = localStorage.getItem("theme-storage");
if (rawTheme) {
  try {
    const parsed = JSON.parse(rawTheme);
    const theme = parsed?.state?.theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {
    console.error("Failed to parse theme from localStorage", e);
  }
}

const rawSettings = localStorage.getItem("trackforge-settings");
if (rawSettings) {
  try {
    const parsed = JSON.parse(rawSettings);
    const animations = parsed?.state?.animations;
    if (animations === false) {
      document.documentElement.classList.add("no-anim");
    } else {
      document.documentElement.classList.remove("no-anim");
    }
  } catch (e) {
    console.error("Failed to parse animations setting", e);
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

const raw = localStorage.getItem("theme-storage");
const rawSettings = localStorage.getItem("trackforge-settings");

if (raw) {
  try {
    const parsed = JSON.parse(raw);
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

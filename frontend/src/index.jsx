import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import "./index.css";
import "./lib/posthog";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="don-genius-theme" enableSystem>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);

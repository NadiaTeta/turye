import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Vite loads this stylesheet at runtime; TypeScript has no declaration for CSS side-effect imports.
// @ts-expect-error CSS files are handled by the bundler.
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
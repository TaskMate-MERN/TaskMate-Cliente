import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
 // No necesitas importar ni pasar 'theme'
import "./index.css";
import Router from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);

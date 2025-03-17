import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./router.tsx";
import { checkApiConnection } from "./api/checkApi.ts"; // Importa la función de verificación

checkApiConnection(); // Llama a la función para probar la conexión con la API
console.log("🔧 API URL:", import.meta.env.VITE_API_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);

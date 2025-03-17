import axios from "axios";

export const checkApiConnection = async () => {
  console.log("%c🔍 Verificando conexión con la API...", "color: blue; font-weight: bold;"); // Agregado

  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + "/ruta-de-prueba");
    console.log("%c✅ Conectado exitosamente a la API!", "color: green; font-weight: bold;");
  } catch (error) {
    console.error("%c❌ Error conectando con la API:", "color: red;", error);
  }
};
export default checkApiConnection;
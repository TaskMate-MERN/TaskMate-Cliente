import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import { loginUser } from "../../../api/apiUsers"; // Importa tu API
import 'bootstrap-icons/font/bootstrap-icons.css';

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false); // Estado para mostrar/ocultar contraseña
    const [loading, setLoading] = useState<boolean>(false); // Estado para manejar la carga

    const navigate = useNavigate(); // Instancia de useNavigate

    // Validar el correo electrónico
    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Redirigir si ya está autenticado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dash");
        }
    }, [navigate]);

    
    // Manejar el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true); // Activar el estado de carga
      setError(""); // Limpiar errores previos
  
      // Validar el correo electrónico
      if (!validateEmail(email)) {
          setError("Por favor, introduce un correo electrónico válido.");
          setLoading(false); // Desactivar el estado de carga
          return;
      }
  
      // Validar la contraseña
      if (password.length < 8) {
          setError("La contraseña debe tener al menos 8 digitos.");
          setLoading(false); // Desactivar el estado de carga
          return;
      }
  
      try {
          const response = await loginUser({ email, password });
          
          // Verifica la estructura de la respuesta
          console.log("Respuesta de la API:", response);
  
          // Si la respuesta es directamente el token
          const token = response;
          if (!token) {
              throw new Error("No se recibió un token válido.");
          }
  
          console.log("JWT recibido:", token); 
          localStorage.setItem("token", token); // Guarda el token en localStorage
          setSuccess(true); // Indica login exitoso
  
          navigate("/dash"); // Redirige al dashboard después del login
      } catch (err: any) {
          console.error("Error al iniciar sesión:", err);
          setError(err.response?.data?.message || "Error al iniciar sesión."); // Muestra errores
  
          console.error("Error completo:", err);
          if (err.response) {
              console.error("Respuesta del servidor:", err.response.data);
              if (err.response.status === 401) {
                  setError("Crontraseña incorrecta. Por favor, inténtalo de nuevo.");
              } else {
                  setError(`Error no se encontro Usuario: ${err.response.data.message || "Inténtalo más tarde."}`);
              }
          } else if (err.request) {
              setError("No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.");
          } else {
              setError(`Error inesperado: ${err.message || "Inténtalo de nuevo."}`);
          }
      } finally {
          setLoading(false); // Desactivar el estado de carga (incluso si hay un error)
      }
  };

    // Función para mostrar/ocultar la contraseña
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleNavigate = () => {
        navigate("/Create");
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-black">
            {/* VIDEO TASKMATE */}
            <div className="absolute inset-0 overflow-hidden">
                <video autoPlay loop muted className="w-full h-full object-cover">
                    <source src="/taskcomprimido1.webm" type="video/mp4" />
                </video>
            </div>

            {/* Login */}
            <div className="relative z-10 w-[420px] text-white text-center rounded-lg font-calibri p-6 bg-white/05 backdrop-blur-lg border border-white/40 shadow-lg">
                <div className="text-2xl font-semibold">Login TaskMate</div>
                <form className="mt-4" onSubmit={handleSubmit}>
                    {/* Usuario */}
                    <div className="relative mt-6">
                        <input
                            className="w-full bg-transparent text-white text-lg outline-none border-b border-white/50 pb-1 pr-6"
                            type="email"
                            id="email"
                            required
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <span className="absolute right-2 bottom-1 text-gray-300 bi bi-person"></span>
                    </div>

                    {/* Contraseña */}
                    <div className="relative mt-6">
                        <input
                            className="w-full bg-transparent text-white text-lg outline-none border-b border-white/50 pb-1 pr-6"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <span
                            className="absolute right-2 bottom-1 text-gray-300 bi bi-eye cursor-pointer"
                            onClick={togglePasswordVisibility}
                        ></span>
                    </div>

                    {/* Mensaje de Error */}
                    {error && <div className="text-red-500 mt-4">{error}</div>}

                    {/* Botón Login */}
                    <input
                        type="submit"
                        value={loading ? "Cargando..." : "Login"}
                        disabled={loading}
                        className="cursor-pointer bg-white/20 w-full text-white rounded-md mt-6 text-lg p-2 hover:opacity-80"
                    />
                </form>

                {/* Mensaje de Éxito */}
                {success && (
                    <div className="text-green-500 mt-4">¡Login exitoso! Redirigiendo...</div>
                )}

                <div className="flex items-center gap-4 justify-center mt-6">
                    <div className="w-2/5 h-px bg-white/30"></div>
                    <div>or</div>
                    <div className="w-2/5 h-px bg-white/30"></div>
                </div>

                {/* Registro */}
                <div className="mt-6 text-sm">
                        ¿No estás registrado?{" "}
                        <span className="text-green-300 hover:underline cursor-pointer" onClick={handleNavigate}>
                        Regístrate Aquí
                    </span>
                </div>


            </div>
        </div>
    );
}

export default Login;

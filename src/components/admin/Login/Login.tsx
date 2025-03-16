import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import { loginUser } from "../../../api/apiUsers"; // Importa tu API
import 'bootstrap-icons/font/bootstrap-icons.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // Instancia de useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiamos errores previos
    try {
        const response = await loginUser({ email, password });
        
        // Asegúrate de que el token venga en response.token
        console.log("JWT recibido:", response); 
        localStorage.setItem("token", response); // Guarda el token en localStorage
        setSuccess(true); // Indica login exitoso

        navigate("/dashboard"); // Redirige al dashboard después del login
    } catch (err: any) {
        console.error("Error al iniciar sesión:", err);
        setError(err.response?.data?.message || "Error al iniciar sesión."); // Muestra errores
    }
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
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <span className="absolute right-2 bottom-1 text-gray-300 bi bi-eye cursor-pointer"></span>
          </div>

          {/* Mensaje de Error */}
          {error && <div className="text-red-500 mt-4">{error}</div>}

          {/* Botón Login */}
          <input
            type="submit"
            value="Login"
            className="cursor-pointer bg-white/20 w-full text-white rounded-md mt-6 text-lg p-2 hover:opacity-80"
          />
        </form>

        {/* Mensaje de Éxito */}
        {success && <div className="text-green-500 mt-4">¡Login exitoso!</div>}

        <div className="flex items-center gap-4 justify-center mt-6">
          <div className="w-2/5 h-px bg-white/30"></div>
          <div>or</div>
          <div className="w-2/5 h-px bg-white/30"></div>
        </div>

        {/* Registro */}
        <div className="mt-6 text-sm">
          ¿No estás registrado?{" "}
          <a href="#" className="text-green-300 hover:underline">
            Regístrate Aquí
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;

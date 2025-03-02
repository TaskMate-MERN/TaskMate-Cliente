import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        <form className="mt-4">
          {/* Usuario */}
          <div className="relative mt-6">
            <input
              className="w-full bg-transparent text-white text-lg outline-none border-b border-white/50 pb-1 pr-6"
              type="text"
              id="username"
              required
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username" // Agrega un placeholder para mejor UX
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

          {/* Opciones */}
          <div className="flex justify-between text-sm text-gray-300 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="save-info" className="cursor-pointer" />
              Stay signed in
            </label>
            <a href="#" className="text-green-300 hover:underline">
              ¿Necesitas ayuda para iniciar sesión?
            </a>
          </div>

          <input
            type="submit"
            value="Login"
            className="cursor-pointer bg-white/20 w-full text-white rounded-md mt-6 text-lg p-2 hover:opacity-80"
          />
        </form>

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
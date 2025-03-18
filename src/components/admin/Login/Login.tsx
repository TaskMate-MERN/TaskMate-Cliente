import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import { loginUser, requestAuthToken, confirmUser } from "../../../api/apiUsers"; // Importa tu API
import 'bootstrap-icons/font/bootstrap-icons.css';

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false); // Estado para mostrar/ocultar contraseña
    const [loading, setLoading] = useState<boolean>(false); // Estado para manejar la carga
    const [unconfirmedUser, setUnconfirmedUser] = useState<boolean>(false); // Estado para usuarios no confirmados
    const [token, setToken] = useState<string[]>(Array(6).fill("")); // Estado para el token de 6 dígitos
    const [verified, setVerified] = useState<boolean>(false); // Estado para verificación exitosa
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Referencias para los inputs del token

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

    // Manejar el envío del formulario de login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validar el correo electrónico
        if (!validateEmail(email)) {
            setError("Por favor, introduce un correo electrónico válido.");
            setLoading(false);
            return;
        }

        try {
            const response = await loginUser({ email, password });

            // Si la respuesta es directamente el token
            const token = response;
            if (!token) {
                throw new Error("No se recibió un token válido.");
            }

            localStorage.setItem("token", token);
            setSuccess(true);
            navigate("/dash"); // Redirige al dashboard después del login
        } catch (err: any) {
            console.error("Error al iniciar sesión:", err);

            if (err.response?.status === 401) {
                setError("Credenciales incorrectas.");
            } else if (err.response?.status === 404) {
                setError("El correo electrónico no está registrado.");
            } else if (err.response?.status === 409 && err.response.data.code === 'USER_NOT_CONFIRMED') {
                setError("Usuario no confirmado. Te hemos enviado un token de confirmación a tu correo.");
                setUnconfirmedUser(true); // Mostrar el formulario de token
            } else {
                setError("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.saludos");
            }
        } finally {
            setLoading(false);
        }
    };

    // Función para mostrar/ocultar la contraseña
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Manejar cambios en los inputs del token
    const handleTokenChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Solo permitir números
        const newToken = [...token];
        newToken[index] = value;
        setToken(newToken);

        // Mover el foco al siguiente input
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        // Si se completa el token, validar automáticamente
        if (newToken.every((digit) => digit !== "")) {
            validateToken(newToken.join(""));
        }
    };

    // Manejar pegado del token
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6); // Limitar a 6 dígitos
        if (!/^\d{6}$/.test(pastedData)) return; // Solo permitir 6 números

        const newToken = pastedData.split("");
        setToken(newToken);
        validateToken(newToken.join(""));
    };

    // Validar el token
    const validateToken = async (token: string) => {
        setLoading(true);
        setError("");
    
        try {
            const response = await confirmUser(token);
            console.log("Respuesta de la API:", response);
            setVerified(true); // Mostrar mensaje de "Cuenta verificada"
            setError(""); // Limpiar errores previos
        } catch (err: any) {
            console.error("Error al confirmar usuario:", err);
            setError(err.response?.data?.message || "Error al confirmar usuario.");
            setToken(Array(6).fill("")); // Limpiar los campos
            inputRefs.current[0]?.focus(); // Enfocar el primer input
        } finally {
            setLoading(false);
        }
    };
    
    // Función para regresar al formulario de login
    const handleBackToLogin = () => {
        setUnconfirmedUser(false); // Ocultar el formulario de token
        setVerified(false); // Reiniciar el estado de verificación
        setToken(Array(6).fill("")); // Limpiar el token
    };

    // Función para reenviar el token de confirmación
    const handleResendToken = async () => {
        try {
            await requestAuthToken(email); // Llama a la API para reenviar el token
            setError("Token reenviado. Por favor, revisa tu correo.");
        } catch (err: any) {
            setError("Error al reenviar el token. Inténtalo de nuevo.");
        }
    };

    // Función para redirigir a la página de registro
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

            {/* Login o Confirmación de Cuenta */}
            <div className="relative z-10 w-[420px] text-white text-center rounded-lg font-calibri p-6 bg-white/05 backdrop-blur-lg border border-white/40 shadow-lg">
                {!unconfirmedUser ? (
                    <>
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
                    </>
                ) : (
                    <>
                         <div className="text-2xl font-semibold">Confirmar Cuenta</div>
    <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
        {/* Token de Confirmación */}
        <div className="flex justify-center gap-2 mt-6">
            {token.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    className="w-10 h-10 bg-transparent text-white text-lg text-center outline-none border-b border-white/50"
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleTokenChange(index, e.target.value)}
                    onPaste={handlePaste}
                    disabled={loading || verified}
                />
            ))}
        </div>

        {/* Mensaje de Error */}
        {error && <div className="text-red-500 mt-4">{error}</div>}

        {/* Mensaje de Cuenta Verificada */}
        {verified && (
            <div className="text-green-500 mt-4">
                ¡Cuenta verificada! Ahora puedes iniciar sesión.
            </div>
        )}

        {/* Botón para regresar al login */}
        {verified && (
            <button
                type="button"
                onClick={handleBackToLogin}
                className="cursor-pointer bg-white/20 w-full text-white rounded-md mt-6 text-lg p-2 hover:opacity-80"
            >
                Regresar al Login
            </button>
        )}

        {/* Botón para reenviar el token */}
        {!verified && (
            <button
                type="button"
                onClick={handleResendToken}
                className="mt-4 text-sm text-green-300 hover:underline cursor-pointer"
            >
                Reenviar token de confirmación
            </button>
        )}
    </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;
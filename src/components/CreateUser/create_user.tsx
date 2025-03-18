import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, confirmUser, requestAuthToken } from "../../api/apiUsers"; // Importa las APIs

function SignUp() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [token, setToken] = useState<string[]>(Array(6).fill("")); // Array para los 6 dígitos
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isConfirming, setIsConfirming] = useState<boolean>(false); // Para cambiar entre registro y confirmación
    const [verified, setVerified] = useState<boolean>(false); // Estado para indicar si el token es válido
    const [tokenSent, setTokenSent] = useState<boolean>(false); // Estado para indicar que se envió el token
    const [, setSuccess] = useState<boolean>(false); // Estado para indicar éxito en el registro

    const navigate = useNavigate();
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null)); // Referencias para los inputs

    // Validar el correo electrónico
    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Manejar el registro de usuario
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validaciones
        if (!name || !email || !password || !confirmPassword) {
            setError("Todos los campos son obligatorios.");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Por favor, introduce un correo electrónico válido.");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 digitos.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setLoading(false);
            return;
        }

        try {
            const response = await createUser({ name, email, password, confirm_password: confirmPassword });
            console.log("Respuesta de la API:", response);
            setSuccess(true);
            setIsConfirming(true); // Cambiar a la pantalla de confirmación
            setTokenSent(true); // Indicar que se envió el token
            setError(""); // Limpiar errores previos
        } catch (err: any) {
            console.error("Error al registrar usuario:", err);

            if (err.response?.status === 404) {
                if (err.response.data.code === "USER_NOT_CONFIRMED") {
                    setError(err.response.data.message);
                    setTimeout(() => {
                        navigate("/login"); // Redirige al login después de 2 segundos
                    }, 2000);
                }
            } else if (err.response?.status === 409) {
                setError("El correo ya está registrado. Utiliza otro.");
            } else {
                setError(err.response?.data?.message || "Error al registrar usuario.");
            }
        } finally {
            setLoading(false);
        }
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
            setTimeout(() => {
                navigate("/login"); // Redirigir al login después de 2 segundos
            }, 2000);
        } catch (err: any) {
            console.error("Error al confirmar usuario:", err);
            setError(err.response?.data?.message || "Error al confirmar usuario.");
            setToken(Array(6).fill("")); // Limpiar los campos
            inputRefs.current[0]?.focus(); // Enfocar el primer input
        } finally {
            setLoading(false);
        }
    };

    // Función para solicitar un nuevo token
    const handleResendToken = async () => {
        setLoading(true);
        setError("");

        try {
            await requestAuthToken(email); // Llama a la API para reenviar el token
            setTokenSent(true); // Indicar que se envió el token
            setError("Se ha enviado un nuevo token de confirmación a tu correo.");
        } catch (err: any) {
            console.error("Error al reenviar el token:", err);
            setError("Error al reenviar el token. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
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

            {/* Formulario de Registro o Confirmación */}
            <div className="relative z-10 w-[420px] text-white text-center rounded-lg font-calibri p-6 bg-white/05 backdrop-blur-lg border border-white/40 shadow-lg">
                {!isConfirming ? (
                    <>
                        <div className="text-2xl font-semibold">Registro en TaskMate</div>
                        <form className="mt-4" onSubmit={handleSignUp}>
                            {/* Nombre */}
                            <div className="relative mt-6">
                                <input
                                    className="w-full bg-transparent text-white text-lg outline-none border-b border-white/50 pb-1 pr-6"
                                    type="text"
                                    id="name"
                                    required
                                    autoComplete="off"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nombre"
                                />
                            </div>

                            {/* Correo Electrónico */}
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
                                    placeholder="Contraseña"
                                />
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className="relative mt-6">
                                <input
                                    className="w-full bg-transparent text-white text-lg outline-none border-b border-white/50 pb-1 pr-6"
                                    type="password"
                                    id="confirm_password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirmar Contraseña"
                                />
                            </div>

                            {/* Mensaje de Error */}
                            {error && <div className="text-red-500 mt-4">{error}</div>}

                            {/* Botón de Registro */}
                            <input
                                type="submit"
                                value={loading ? "Cargando..." : "Registrarse"}
                                disabled={loading}
                                className="cursor-pointer bg-white/20 w-full text-white rounded-md mt-6 text-lg p-2 hover:opacity-80"
                            />
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-2xl font-semibold">Confirmar Cuenta</div>
                        <form className="mt-4">
                            {/* Mensaje de éxito al enviar el token */}
                            {tokenSent && (
                                <div className="text-green-500 mt-4">
                                    Se ha enviado un token de confirmación a tu correo.
                                </div>
                            )}

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
                                        disabled={loading || verified} // Deshabilitar si está cargando o ya está verificado
                                    />
                                ))}
                            </div>

                            {/* Mensaje de Error */}
                            {error && <div className="text-red-500 mt-4">{error}</div>}

                            {/* Mensaje de Cuenta Verificada */}
                            {verified && (
                                <div className="text-green-500 mt-4">
                                    ¡Cuenta verificada! Redirigiendo al login...
                                </div>
                            )}

                            {/* Botón para reenviar el token */}
                            <button
                                type="button"
                                onClick={handleResendToken}
                                disabled={loading || verified}
                                className="cursor-pointer bg-white/20 w-full text-white rounded-md mt-6 text-lg p-2 hover:opacity-80"
                            >
                                {loading ? "Cargando..." : "Reenviar token de confirmación"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default SignUp;
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordChange, confirmPasswordToken, changePassword, loginUser } from "../../api/apiUsers"; // Importa las funciones de tu API
import 'bootstrap-icons/font/bootstrap-icons.css';

function ChangePassword() {
    const [email, setEmail] = useState<string>("");
    const [token, setToken] = useState<string[]>(Array(6).fill("")); // Estado para el token de 6 dígitos
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showTokenForm, setShowTokenForm] = useState<boolean>(false); // Estado para mostrar el formulario del token
    const [verifiedToken, setVerifiedToken] = useState<boolean>(false); // Estado para verificar si el token es válido
    const [unverifiedUser, setUnverifiedUser] = useState<boolean>(false); // Estado para usuarios no verificados
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

    // Manejar el envío del correo electrónico para solicitar el token
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!validateEmail(email)) {
            setError("Por favor, introduce un correo electrónico válido.");
            setLoading(false);
            return;
        }

        try {
            // Verificar si el usuario está confirmado intentando hacer login
            await loginUser({ email, password: "dummyPassword" }); // Usamos una contraseña dummy para verificar el estado del usuario
        } catch (err: any) {
            if (err.response?.status === 409) { // Si el usuario no está verificado
                unverifiedUser 
                setUnverifiedUser(true);
                setError("Tu cuenta no está verificada. Por favor, verifica tu cuenta primero. En el login puedes confirmar tu correo");
                setLoading(false);
                return;
            }
        }

        try {
            // Si el usuario está verificado, solicitar el token de cambio de contraseña
            await requestPasswordChange(email); // Llama a la API para solicitar el token
            setShowTokenForm(true); // Muestra el formulario del token
            setError(""); // Limpiar errores
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al solicitar el token. Inténtalo de nuevo.");
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

        // Mover el foco al siguiente input si se ingresa un dígito
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        // Mover el foco al input anterior si se elimina un dígito
        if (!value && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
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
        newToken.forEach((digit, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index]!.value = digit;
            }
        });
        inputRefs.current[5]?.focus(); // Mover el foco al último campo
        validateToken(newToken.join(""));
    };

    // Validar el token
    const validateToken = async (token: string) => {
        setLoading(true);
        setError("");

        try {
            await confirmPasswordToken(token); // Llama a la API para confirmar el token
            setVerifiedToken(true); // Marca el token como verificado
            setError(""); // Limpiar errores
        } catch (err: any) {
            setError(err.response?.data?.message || "Token inválido. Inténtalo de nuevo.");
            setToken(Array(6).fill("")); // Limpiar los campos
            inputRefs.current[0]?.focus(); // Enfocar el primer input
        } finally {
            setLoading(false);
        }
    };

    // Manejar el cambio de contraseña
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setLoading(false);
            return;
        }

        try {
            await changePassword({ token: token.join(""), password, confirm_password: confirmPassword }); // Llama a la API para cambiar la contraseña
            setSuccess(true);
            setTimeout(() => {
                navigate("/login"); // Redirige al login después de cambiar la contraseña
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cambiar la contraseña.necesita mas de 8 caracterez Inténtalo de nuevo.");
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

            {/* Formulario de Cambio de Contraseña */}
            <div className="relative z-10 w-[420px] text-white text-center rounded-lg font-calibri p-6 bg-white/05 backdrop-blur-lg border border-white/40 shadow-lg">
                {!showTokenForm ? (
                    <>
                        <div className="text-2xl font-semibold">Cambiar Contraseña</div>
                        <form className="mt-4" onSubmit={handleEmailSubmit}>
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
                                <span className="absolute right-2 bottom-1 text-gray-300 bi bi-person"></span>
                            </div>

                            {/* Mensaje de Error */}
                            {error && <div className="text-green-500 mt-4">{error}</div>}

                            {/* Botón para Solicitar Token */}
                            <input
                                type="submit"
                                value={loading ? "Cargando..." : "Enviar Token"}
                                disabled={loading}
                                className="cursor-pointer bg-white/20 w-full text-white rounded-md mt-6 text-lg p-2 hover:opacity-80"
                            />
                        </form>
                    </>
                ) : (
                    <>
                        {!verifiedToken ? (
                            <>
                                <div className="text-2xl font-semibold">Introduce el Token</div>
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
                                                disabled={loading}
                                            />
                                        ))}
                                    </div>

                                    {/* Mensaje de Error */}
                                    {error && <div className="text-green-500 mt-4">{error}</div>}

                                    {/* Botón para Reenviar Token */}
                                    <button
                                        type="button"
                                        onClick={handleEmailSubmit}
                                        className="mt-4 text-sm text-green-300 hover:underline cursor-pointer"
                                    >
                                        Reenviar Token
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-semibold">Cambiar Contraseña</div>
                                <form className="mt-4" onSubmit={handlePasswordChange}>
                                    {/* Nueva Contraseña */}
                                    <div className="relative mt-6">
                                        <input
                                            className="w-full bg-transparent text-white text-lg outline-none border-b border-white/50 pb-1 pr-6"
                                            type="password"
                                            id="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Nueva Contraseña"
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
                                    {error && <div className="text-green-500 mt-4">{error}</div>}

                                    {/* Mensaje de Éxito */}
                                    {success && (
                                        <div className="text-green-500 mt-4">¡Contraseña cambiada exitosamente! Redirigiendo...</div>
                                    )}

                                    {/* Botón para Cambiar Contraseña */}
                                    <input
                                        type="submit"
                                        value={loading ? "Cargando..." : "Cambiar Contraseña"}
                                        disabled={loading}
                                        className="cursor-pointer bg-white/20 w-full text-white rounded-md mt-6 text-lg p-2 hover:opacity-80"
                                    />
                                </form>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ChangePassword;
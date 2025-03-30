import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, requestPasswordChange, confirmPasswordToken, changePassword } from "../../../api/apiUsers";

interface UserData {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  // Estados del perfil
  const [user, setUser] = useState<UserData | null>(null);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameSuccess, setNameSuccess] = useState("");
  const [, setIsLoading] = useState(true); // Nuevo estado para carga inicial

  // Estados de cambio de contraseña
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [step, setStep] = useState<"request" | "verify" | "change">("request");
  const [loading, setLoading] = useState(false);

  // Estado para el modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userData = await getProfile();
        setUser(userData);
        setNewName(userData.name);
      } catch (err) {
        console.error("Error de autenticación", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Manejar actualización del nombre
  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      setNameError("El nombre no puede estar vacío");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(newName);
      setUser(prev => prev ? {...prev, name: newName} : null);
      setNameSuccess("Nombre actualizado correctamente");
      setEditName(false);
      setTimeout(() => setNameSuccess(""), 3000);
    } catch (err) {
      setNameError("Error al actualizar el nombre");
    } finally {
      setLoading(false);
    }
  };

  // Solicitar token para cambio de contraseña
  const requestPasswordToken = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      await requestPasswordChange(user.email);
      setStep("verify");
      setPasswordSuccess("Se ha enviado un token a tu correo");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      setPasswordError("Error al solicitar el token");
    } finally {
      setLoading(false);
    }
  };

  // Verificar token
  const verifyToken = async () => {
    try {
      setLoading(true);
      await confirmPasswordToken(token);
      setStep("change");
      setPasswordSuccess("Token verificado correctamente");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      setPasswordError("Token inválido");
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      setLoading(true);
      await changePassword({ token, password, confirm_password: confirmPassword });
      setModalMessage("Contraseña cambiada exitosamente");
      setShowSuccessModal(true);
      setPassword("");
      setConfirmPassword("");
      setToken("");
      setStep("request");
    } catch (err) {
      setPasswordError("Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Cerrar modal
  const closeModal = () => {
    setShowSuccessModal(false);
    setShowPasswordSection(false);
  };

  if (!user) return <div className="p-6">Cargando perfil...</div>;

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-3">{modalMessage}</h3>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sección General */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">General</h1>
        
        {/* Información del usuario */}
        <div className="mb-8 p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">{user.name} / General</h2>
          </div>
          <p className="text-gray-600 mb-4">Actualiza tu información y administra tu cuenta</p>
          
          {/* Edición de nombre */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Nombre</h3>
              {editName ? (
                <div className="flex gap-2">
                  <button 
                    onClick={handleNameUpdate}
                    disabled={loading}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={() => {
                      setEditName(false);
                      setNewName(user.name);
                      setNameError("");
                    }}
                    className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setEditName(true)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Editar
                </button>
              )}
            </div>
            
            {editName ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNameError("");
                }}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{user.name}</p>
            )}
            
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            {nameSuccess && <p className="text-green-500 text-sm mt-1">{nameSuccess}</p>}
          </div>
          
          {/* Email (solo lectura) */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Email</h3>
            <p className="p-2 bg-gray-50 rounded">{user.email}</p>
          </div>
        </div>

        {/* Sección de contraseña */}
        <div className="mb-8">
          <div 
            className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
          >
            <h2 className="text-lg font-semibold">Contraseña</h2>
            <span className="text-gray-500">
              {showPasswordSection ? "▲" : "▼"}
            </span>
          </div>
          
          {showPasswordSection && (
            <div className="mt-4 p-4 border rounded-lg">
              {step === "request" && (
                <div>
                  <p className="text-gray-600 mb-4">Para cambiar tu contraseña, primero solicita un token de verificación</p>
                  <button
                    onClick={requestPasswordToken}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Solicitar Token
                  </button>
                </div>
              )}
              
              {step === "verify" && (
                <div>
                  <p className="text-gray-600 mb-2">Ingresa el token que recibiste en tu correo</p>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => {
                        setToken(e.target.value);
                        setPasswordError("");
                      }}
                      placeholder="Token de 6 dígitos"
                      className="p-2 border rounded flex-1"
                    />
                    <button
                      onClick={verifyToken}
                      disabled={loading || token.length < 6}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                    >
                      Verificar
                    </button>
                  </div>
                </div>
              )}
              
              {step === "change" && (
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Confirmar Contraseña</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError("");
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Cambiar Contraseña
                  </button>
                </form>
              )}
              
              {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 text-sm mt-2">{passwordSuccess}</p>}
            </div>
          )}
        </div>

        {/* Cerrar sesión */}
        <div className="mb-8">
          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
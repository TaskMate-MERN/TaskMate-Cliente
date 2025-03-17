import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para el menú desplegable
    const navigate = useNavigate();

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token"); // Elimina el token
        navigate("/login"); // Redirige al login
    };

    return (
        <nav className="bg-gray-900 text-white p-4 grid grid-cols-3 items-center">
            {/* Logo a la izquierda */}
            <div className="text-xl font-bold">
                Your Logo
            </div>

            {/* Enlaces centrados */}
            <div className="flex justify-center space-x-6">
                <a href="#" className="hover:text-gray-300">WorkSpace</a>
                <a href="#" className="hover:text-gray-300">Projects</a>
            </div>

            {/* Íconos a la derecha */}
            <div className="flex justify-end space-x-4 relative">
                <FaSearch className="cursor-pointer text-2xl" />
                <FaBell className="cursor-pointer text-2xl" />
                {/* Ícono de usuario con menú desplegable */}
                <div className="relative">
                    <FaUserCircle
                        className="cursor-pointer text-2xl"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Abrir/cerrar el menú
                    />
                    {/* Menú desplegable */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg">
                            <ul>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navigate("/profile")} // Redirigir al perfil (opcional)
                                >
                                    Perfil
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={handleLogout} // Cerrar sesión
                                >
                                    Cerrar Sesión
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
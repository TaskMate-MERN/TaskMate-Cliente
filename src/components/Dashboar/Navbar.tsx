import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
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
      <div className="flex justify-end space-x-4">
        <FaSearch className="cursor-pointer text-2xl" /> 
        <FaBell className="cursor-pointer text-2xl" /> 
        <FaUserCircle className="cursor-pointer text-2xl" />
      </div>
    </nav>
  );
}

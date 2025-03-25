// pages/Dashboard.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ProjectNavbar from "./ProjectNavBar";
import KanbanBoard from "./KanbanBoard";

const Dashboard = () => {
    const navigate = useNavigate();

    // Verificar si el usuario está autenticado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirige al login si no hay token
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#e9d3f4] to-[#E4D2EB]">
            <Navbar />
            <ProjectNavbar />

            {/* Main Content */}
            <div className="p-5">
                <h1 className="text-5xl font-bold text-blue-900 flex items-center space-x-2 ">
                    <span> Tareas </span>
                    <span className="animate-bounce">📙</span>
                    <span className="animate-bounce">🖋️</span>
                </h1>

                {/* Botones con margen inferior aumentado */}
                <div className="flex justify-self-center gap-4 my-4 mb-6">
                    <button className="bg-purple-600 text-white px-16 py-3 rounded-full font-semibold text-lg 
                        transition-transform duration-300 hover:scale-105 hover:bg-purple-700">
                        Agregar Tarea
                    </button>

                    <button className="bg-red-600 text-white px-16 py-3 rounded-full font-semibold text-lg 
                        transition-transform duration-300 hover:scale-105 hover:bg-red-700">
                        Colaboradores
                    </button>
                </div>

                <KanbanBoard />
            </div>
        </div>
    );
};

export default Dashboard;
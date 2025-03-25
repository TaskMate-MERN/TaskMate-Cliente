import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import ProjectNavbar from "./ProjectNavBar";
import KanbanBoard from "./KanbanBoard";

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Verificar si el usuario está autenticado y obtener el proyecto
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // Si viene de la navegación con estado
      if (location.state?.currentProject) {
        setCurrentProject(location.state.currentProject);
      }
    }
  }, [navigate, location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffffff] to-[#e6e4e8]">
      <Navbar />
      <ProjectNavbar project={currentProject} />

      {/* Main Content - Todo se mantiene igual */}
      <div className="p-5">
        <h1 className="text-5xl font-bold text-blue-900 flex items-center space-x-2">
          <span>Tareas</span>
          <span className="animate-bounce">📙</span>
          <span className="animate-bounce">🖋️</span>
        </h1>

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

        <KanbanBoard projectId={currentProject?.id} />
      </div>
    </div>
  );
};

export default Dashboard;
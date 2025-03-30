import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Dashboard_Principal/Navbar";
import ProjectNavbar from "./ProjectNavBar";
import KanbanBoard from "../Dashboard/KanbanBoard";



interface Project {
  _id: string;  // Cambiado de id a _id
  title: string;
  client: string;
  description: string;
  // Añade los demás campos que recibes
  createdAt?: string;
  manager?: string;
  status?: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Verifica todos los posibles nombres de propiedades
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // Asegúrate de manejar tanto currentProject como project
      const projectData = location.state?.currentProject || location.state?.project;
      
      if (projectData) {
        console.log("Proyecto recibido:", projectData);
        // Normaliza el objeto proyecto
        const normalizedProject = {
          _id: projectData._id,
          title: projectData.title,
          client: projectData.client,
          description: projectData.description,
          // ... otros campos necesarios
        };
        setCurrentProject(normalizedProject);
        localStorage.setItem("currentProject", JSON.stringify(normalizedProject));
      } else {
        const savedProject = localStorage.getItem("currentProject");
        if (savedProject) {
          try {
            setCurrentProject(JSON.parse(savedProject));
          } catch (error) {
            console.error("Error parsing project:", error);
          }
        }
      }
    }
  }, [navigate, location.state]);

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffffff] to-[#ffffff]">
      <Navbar />
      <ProjectNavbar project={currentProject} />
      <div className="p-5">
      <div className="flex items-center gap-3 mb-4">
  <h1 className="text-5xl font-bold text-blue-900">Tareas</h1>
  <div className="flex space-x-2">
    <span className="text-4xl animate-bounce">📙</span>
    <span className="text-4xl animate-pulse">🖋️</span>
  </div>
</div>
        
        {currentProject ? (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Proyecto actual: {currentProject.title} (ID: {currentProject._id})
            </p>
            <KanbanBoard projectId={currentProject?._id} /> 
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              Selecciona un proyecto para ver sus tareas
            </p>
            <button 
              onClick={() => navigate('/projects')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Ir a Proyectos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
import React from "react";

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
}

interface ProjectNavbarProps {
  project?: Project | null;
}

const ProjectNavbar: React.FC<ProjectNavbarProps> = ({ project }) => {
  return (
    <nav className="bg-[#6a4a80] text-white flex justify-between items-center px-6 py-3 w-full">
      {/* Contenedor izquierdo (título del proyecto) */}
      <div className="text-lg font-bold relative text-white 
        before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-blue-400 before:transition-all before:duration-300 before:ease-in-out 
        hover:before:w-full hover:text-blue-300">
        {project?.title || "Selecciona un proyecto"}
      </div>

      {/* Contenedor derecho (cliente + botones) */}
      <div className="flex items-center gap-4">
        {/* Nombre del cliente alineado a la derecha */}
        {project?.client && (
          <span className="text-white text-opacity-80 font-medium">
            {project.client}
          </span>
        )}

        {/* Botones (se mantienen igual) */}
        <div className="flex gap-2">
          <button className="bg-white text-black rounded-full p-2">
            <img src="/iconP.jpg" alt="Icono" className="w-6 h-6" />
          </button>
          <button className="bg-white text-black rounded-full p-2">
            <img src="/iconP.jpg" alt="Icono" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ProjectNavbar;
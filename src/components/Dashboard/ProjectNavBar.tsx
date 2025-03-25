// components/ProjectNavbar.tsx
import React from "react";

const ProjectNavbar = () => {
  return (
    <nav className="bg-[#6a4a80] text-white flex justify-between items-center px-6 py-3 w-full">
      <div className="text-lg font-bold relative text-white 
        before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-blue-400 before:transition-all before:duration-300 before:ease-in-out 
        hover:before:w-full hover:text-blue-300">
        Project Name
      </div>

      <div className="flex gap-2 items-center">
        <button className="bg-white text-black rounded-full p-2">
          <img src="/iconP.jpg" alt="Icono" className="w-6 h-6" />
        </button>
        <button className="bg-white text-black rounded-full p-2">
          <img src="/iconP.jpg" alt="Icono" className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default ProjectNavbar;
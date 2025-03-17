import React from "react";

const Dashboard = () => {
  return (
<div className="min-h-screen bg-gradient-to-b from-[#e9d3f4] to-[#E4D2EB]">

      {/* Navbar */}
      <nav className="bg-[#D9D9D9] text-black flex justify-between items-center px-6 py-3 w-full">
         
  {/* Sección Izquierda */}
  <div className="flex items-center space-x-6">
    <div className="text-lg font-bold">Your Logo</div>
    <a href="#" className="text-lg font-bold">WorkSpace</a>
    <a href="#" className="text-lg font-bold">Projects</a>
    <button className="bg-[#003e79] px-20 py-1 rounded-full font-semibold text-white 
  transition-all duration-300 ease-in-out 
  hover:bg-[#0079b5d3] hover:shadow-lg 
  active:scale-95 
  hover:ring-2 hover:ring-blue-300">
  Create
</button>

  </div>


  {/* Sección Derecha */}
  <div className="flex gap-4 items-center">
  <button className="bg-white text-black rounded-full p-2 transition-transform duration-300 hover:scale-110 hover:shadow-lg">
    <img src="/iconLens.jpg" alt="Icono" className="w-6 h-6" />
  </button>

  <button className="bg-white text-black rounded-full p-2 transition-transform duration-300 hover:rotate-12 hover:scale-110 hover:shadow-lg">
    <img src="/iconBell.jpg" alt="Icono" className="w-6 h-6" />
  </button>
  <button className="bg-white text-black rounded-full p-2 transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:animate-wiggle">
    👤
  </button>
</div>

  
</nav>
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

  {/* Kanban Board */}
  <div className="grid grid-cols-5 gap-4">
    {["Pendiente", "En Espera", "En Progreso", "Revisión", "Completado"].map((title, index) => {
      const statusColors = ["border-purple-500", "border-green-500", "border-blue-500", "border-yellow-500", "border-gray-500"];

      return (
        <div key={index} className="w-full">
          {/* Título con línea de color personalizado */}
          <h2 className={`text-center font-bold border-b-2 pb-1 mb-2 ${statusColors[index]}`}>
            {title}
          </h2>

          <div className="space-y-3">
            {/* Área para soltar tareas */}
            <div className="bg-green-200 text-black text-center p-4 rounded-full">Soltar Tarea Aquí</div>

            {/* Tareas ficticias */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-red-300 p-4 rounded-full">&nbsp;</div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
</div>

    </div>
  );
};

export default Dashboard;

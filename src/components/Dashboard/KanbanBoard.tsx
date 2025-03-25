// components/KanbanBoard.tsx
import React from "react";

const KanbanBoard = () => {
  return (
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
  );
};

export default KanbanBoard;
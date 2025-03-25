import React, { useEffect, useState } from "react";
import { Task } from "../../Types/types"; // Asegúrate de tener esta interfaz definida

interface KanbanBoardProps {
  projectId?: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulamos la carga de tareas basadas en el projectId
  useEffect(() => {
    if (projectId) {
      // Aquí iría tu llamada API real para obtener las tareas del proyecto
      const fetchTasks = async () => {
        try {
          // Ejemplo de datos simulados
          const mockTasks: Task[] = [
            {
              id: "1",
              title: "Diseñar interfaz de usuario",
              description: "Crear wireframes para el dashboard",
              status: "En Progreso",
              projectId: projectId,
              dueDate: "2023-12-15"
            },
            {
              id: "2",
              title: "Configurar base de datos",
              description: "Crear esquema inicial de la base de datos",
              status: "Pendiente",
              projectId: projectId,
              dueDate: "2023-12-10"
            },
            {
              id: "3",
              title: "Revisar requerimientos",
              description: "Validar especificaciones con el cliente",
              status: "Revisión",
              projectId: projectId,
              dueDate: "2023-12-05"
            }
          ];
          
          setTasks(mockTasks);
          setLoading(false);
        } catch (error) {
          console.error("Error al cargar tareas:", error);
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [projectId]);

  const statusColumns = ["Pendiente", "En Espera", "En Progreso", "Revisión", "Completado"];

  const statusColors: Record<string, string> = {
    "Pendiente": "border-purple-500 bg-purple-50",
    "En Espera": "border-green-500 bg-green-50",
    "En Progreso": "border-blue-500 bg-blue-50",
    "Revisión": "border-yellow-500 bg-yellow-50",
    "Completado": "border-gray-500 bg-gray-50"
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!projectId) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Selecciona un proyecto para ver sus tareas</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-10">Cargando tareas...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statusColumns.map((status) => {
        const columnTasks = tasks.filter(task => task.status === status);
        const columnColor = statusColors[status] || "border-gray-200";

        return (
          <div 
            key={status} 
            className="min-h-[300px]"
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
          >
            {/* Título de la columna */}
            <h2 className={`text-center font-bold border-b-2 pb-2 mb-4 ${columnColor}`}>
              {status} ({columnTasks.length})
            </h2>

            {/* Área de tareas */}
            <div className="space-y-3 min-h-[200px]">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`p-3 rounded-lg shadow-sm border-l-4 ${statusColors[status]} hover:shadow-md transition-shadow cursor-move`}
                  >
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-xs mt-2 text-gray-500">
                        Vence: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div 
                  className="p-4 text-center text-gray-400 rounded-lg border-2 border-dashed"
                >
                  Soltar tareas aquí
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
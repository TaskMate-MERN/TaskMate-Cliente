import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { TaskService } from "../../api/taskServices";
import { ITask, TaskStatus, TaskStatusType } from "../../Types/Task.model";
import EditTaskModal from "./EditTaskModal";
import AddTaskModal from "./AddTaskModal"; // Agregar esta importación
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import MembersModal from "./MembersModal";
import { getProfile } from "../../api/apiUsers";
import { projectService } from "../../api/projectServices";

interface KanbanBoardProps {
  projectId?: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  // Nuevos estados para verificar si el usuario es manager
  const [isManager, setIsManager] = useState(false);
  const [userId, setUserId] = useState<string>("");
  
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null); // Cambiamos de editingTask a taskToEdit
  const [taskToDelete, setTaskToDelete] = useState<{id: string, title: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Nuevo estado para carga durante actualización
  const [showMembersModal, setShowMembersModal] = useState(false);

  // Cargar tareas (sin cambios)
  const loadTasks = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await TaskService.getTasks(projectId);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  // Manejador de drag and drop (sin cambios)
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const taskId = result.draggableId;
    const newStatus = destination.droppableId as TaskStatusType;

    try {
      const taskToUpdate = tasks.find(task => task._id === taskId);
      if (!taskToUpdate) return;

      // Optimistic UI update
      const updatedTasks = tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);

      // Backend update
      await TaskService.updateTask(
        projectId!,
        taskId,
        {
          title: taskToUpdate.title,
          description: taskToUpdate.description,
          status: newStatus
        }
      );
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      setError("No se pudo actualizar la tarea");
      setTasks(tasks); // Revert on error
    }
  };

  // Eliminar tarea (sin cambios)
  const handleDeleteTask = async () => {
    if (!projectId || !taskToDelete) return;
    
    try {
      setIsDeleting(true);
      await TaskService.deleteTask(projectId, taskToDelete.id);
      setTasks(tasks.filter(task => task._id !== taskToDelete.id));
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      setError("No se pudo eliminar la tarea");
    } finally {
      setIsDeleting(false);
    }
  };

  // Actualizar tarea - modificada para usar el estado isUpdating
  const handleUpdateTask = async (updatedTask: ITask) => {
    if (!projectId) return;
    
    try {
      setIsUpdating(true);
      
      // Actualización optimista (optimistic update)
      setTasks(prevTasks => prevTasks.map(task => 
        task._id === updatedTask._id ? { ...task, ...updatedTask } : task
      ));
      
      // Llamada a la API
      const result = await TaskService.updateTask(
        projectId,
        updatedTask._id,
        {
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status
        }
      );
      
      // Actualización con datos confirmados del servidor
      setTasks(prevTasks => prevTasks.map(task => 
        task._id === result._id ? { ...task, ...result } : task
      ));
      
      setTaskToEdit(null); // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      
      // Revertir cambios si hay error
      setTasks(prevTasks => [...prevTasks]);
      
      setError("No se pudo actualizar la tarea");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Crear nueva tarea - nueva función para separar la creación de la edición
  const handleCreateTask = async (newTask: Omit<ITask, '_id'>) => {
    try {
      // No actualizamos el estado aquí, esperamos a recargar las tareas
      await loadTasks(); // Recargar todas las tareas para obtener la nueva tarea con su _id
      return true;
    } catch (error) {
      console.error("Error al crear tarea:", error);
      setError("No se pudo crear la tarea");
      return false;
    }
  };

  const statusColumns = Object.values(TaskService.getStatuses());
  const statusColors: Record<TaskStatusType, string> = {
    [TaskStatus.PENDING]: "border-purple-500 bg-purple-50",
    [TaskStatus.IN_PROGRESS]: "border-blue-500 bg-blue-50",
    [TaskStatus.UNDER_REVIEW]: "border-yellow-500 bg-yellow-50",
    [TaskStatus.COMPLETED]: "border-green-500 bg-green-50"
  };

  // Verificar si el usuario es manager del proyecto
  useEffect(() => {
    const checkIfManager = async () => {
      if (!projectId) return;
      
      try {
       
        const userProfile = await getProfile();
        setUserId(userProfile._id);
        
        const projectDetails = await projectService.getProjectByID(projectId);
      
        setIsManager(userProfile._id === projectDetails.manager);
      } catch (error) {
        console.error("Error al verificar rol de manager:", error);
      }
    };
    
    checkIfManager();
  }, [projectId]);

  if (!projectId) return (
    <div className="text-center py-10">
      <p className="text-lg text-gray-600">Selecciona un proyecto para ver sus tareas</p>
    </div>
  );

  if (loading) return <div className="text-center py-10">Cargando tareas...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-4">
        {/* Botones de acción */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Tareas</h2>
            <span className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${isManager ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {isManager ? 'Manager' : 'Miembro'}
            </span>
          </div>
          <div className="flex gap-2">
          
          {/* Solo mostrar el botón de miembros si el usuario es manager */}
          {isManager && (
            <button
              onClick={() => setShowMembersModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Miembros
            </button>
          )}
           
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nueva Tarea
            </button>
          </div>
        </div>

        {/* Tablero Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusColumns.map((status) => {
            const columnTasks = tasks.filter(task => task.status === status);
            
            return (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm"
                  >
                    <div className={`border-t-4 ${statusColors[status]} rounded-t-lg -mt-4 mx-4`} />
                    <h2 className="text-lg font-semibold text-center my-3">
                      {status} <span className="text-gray-500">({columnTasks.length})</span>
                    </h2>

                    <div className="space-y-3 min-h-[200px]">
                      {columnTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 rounded-lg shadow border-l-4 ${statusColors[status]} bg-white hover:shadow-md transition-transform relative group`}
                            >
                              {/* Controles de tarea (hover) */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTaskToEdit(task);
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Editar"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTaskToDelete({id: task._id, title: task.title});
                                  }}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Eliminar"
                                  disabled={isDeleting && taskToDelete?.id === task._id}
                                >
                                  {isDeleting && taskToDelete?.id === task._id ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  )}
                                </button>
                              </div>

                              <h3 className="font-medium text-gray-800 pr-6">{task.title}</h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                              {task.createdAt && (
                                <p className="text-xs mt-3 text-gray-400">
                                  Creada: {new Date(task.createdAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columnTasks.length === 0 && (
                        <div className="p-6 text-center text-gray-400 rounded-lg border-2 border-dashed border-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Arrastra tareas aquí
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>

    
        {/* Modal para crear nueva tarea */}
        {showAddTaskModal && projectId && (
          <AddTaskModal
            projectId={projectId}
            onTaskAdded={handleCreateTask}
            onClose={() => setShowAddTaskModal(false)}
          />
        )}

        {/* Modal para editar tarea */}
        {taskToEdit && (
          <EditTaskModal
            isOpen={!!taskToEdit}
            onClose={() => setTaskToEdit(null)}
            onSave={handleUpdateTask}
            taskToEdit={taskToEdit}
            projectId={projectId!}
            statusOptions={statusColumns}
          />
        )}

        {/* Modal de confirmación para eliminar tarea */}
        <DeleteConfirmationModal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleDeleteTask}
          isLoading={isDeleting}
          
        />
        
{/*Modal para miembro */}
{projectId && (
  <MembersModal
    isOpen={showMembersModal}
    onClose={() => setShowMembersModal(false)}
    projectId={projectId}
  />
)}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
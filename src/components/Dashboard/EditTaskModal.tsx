// components/Kanban/EditTaskModal.tsx
import React, { useState, useEffect } from "react";
import { ITask, TaskStatusType, TaskStatus } from "../../Types/Task.model";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: ITask) => Promise<void>;
  taskToEdit?: ITask;
  projectId: string;
  statusOptions: TaskStatusType[];
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  projectId,
  statusOptions
}) => {
  const [taskData, setTaskData] = useState<Omit<ITask, '_id' | 'createdAt'>>({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || '',
    status: taskToEdit?.status || TaskStatus.PENDING,
    project: projectId
  });

  useEffect(() => {
    if (taskToEdit) {
      setTaskData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
        project: projectId
      });
    }
  }, [taskToEdit, projectId]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToEdit) return;
  
    try {
      setIsSaving(true);
      setError(null);
      
      // Crear el objeto de tarea actualizada
      const updatedTask = {
        ...taskToEdit,
        ...taskData,
        project: projectId // Asegurar que el projectId esté incluido
      };
      
      await onSave(updatedTask); // Esto ejecutará handleUpdateTask en KanbanBoard
      onClose(); // Cerrar el modal después de guardar
    } catch (err) {
      setError("Error al actualizar la tarea");
      console.error("Update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">
          {taskToEdit ? "Editar Tarea" : "Nueva Tarea"}
        </h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              type="text"
              className="w-full p-2 border rounded"
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              className="w-full p-2 border rounded"
              rows={3}
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="status">
              Estado
            </label>
            <select
              id="status"
              className="w-full p-2 border rounded"
              value={taskData.status}
              onChange={(e) => setTaskData({...taskData, status: e.target.value as TaskStatusType})}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
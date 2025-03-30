import React, { useState } from "react";
import { TaskService } from "../../api/taskServices";
import { ITask, TaskStatusType } from "../../Types/Task.model";

interface AddTaskModalProps {
  projectId: string;
  taskToEdit?: ITask;
  onTaskAdded: (task: Omit<ITask, '_id'>) => Promise<boolean>; // Cambiado a Promise<boolean>
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ projectId, taskToEdit, onTaskAdded, onClose }) => {
  // Inicializar estados con los valores de taskToEdit si existe
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [status, setStatus] = useState<TaskStatusType>(TaskService.getStatuses().PENDING);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
  
    try {
      await TaskService.createTask(projectId, {
        title,
        description,
        status
      });
  
      const success = await onTaskAdded({
        title,
        description,
        status,
        project: projectId
      });
      
      if (success) {
        onClose();
      } else {
        setError("La tarea se creó pero hubo un problema al actualizar la vista");
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Añadir nueva tarea</h2>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="status">
             Estatuss
              </label>
              <select
                id="status"
                className="w-full p-2 border rounded"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatusType)}
              >
                {Object.values(TaskService.getStatuses()).map((statusValue) => (
                  <option key={statusValue} value={statusValue}>
                    {statusValue}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
               Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
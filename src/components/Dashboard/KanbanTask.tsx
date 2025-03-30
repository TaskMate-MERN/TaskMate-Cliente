// components/Kanban/KanbanTask.tsx
import React, { useState } from "react";
import { Draggable } from '@hello-pangea/dnd';
import { ITask } from "../../Types/Task.model";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface KanbanTaskProps {
  task: ITask;
  index: number;
  statusColor: string;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => Promise<void>;
  isDeleting: boolean;  // Agregamos esta prop
}

const KanbanTask: React.FC<KanbanTaskProps> = ({
  task,
  index,
  statusColor,
  onEdit,
  onDelete
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-4 rounded-lg shadow border-l-4 ${statusColor} bg-white hover:shadow-md transition-transform relative group`}
          >
            {/* Controles de tarea (hover) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="Editar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1 text-red-600 hover:text-red-800"
                title="Eliminar"
                disabled={isDeleting}
              >
                {isDeleting ? (
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="¿Eliminar tarea?"
        message={`Estás a punto de eliminar la tarea "${task.title}". Esta acción no se puede deshacer.`}
      />
    </>
  );
};

export default KanbanTask;
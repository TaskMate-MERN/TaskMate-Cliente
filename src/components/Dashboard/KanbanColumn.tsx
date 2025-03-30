// components/Kanban/KanbanColumn.tsx
import React from "react";
import { Droppable } from '@hello-pangea/dnd';
import KanbanTask from "./KanbanTask";
import { ITask, TaskStatusType } from "../../Types/Task.model";

interface KanbanColumnProps {
  status: TaskStatusType;
  tasks: ITask[];
  statusColors: Record<TaskStatusType, string>;
  onEditTask: (task: ITask) => void;
  onDeleteTask: (taskId: string) => Promise<void>;  // Cambiado a Promise<void>
  deletingTaskId: string | null;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  statusColors,
  onEditTask,
  onDeleteTask,
  deletingTaskId
}) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="bg-gray-50 rounded-lg p-4 shadow-sm"
        >
          <div className={`border-t-4 ${statusColors[status]} rounded-t-lg -mt-4 mx-4`} />
          <h2 className="text-lg font-semibold text-center my-3">
            {status} <span className="text-gray-500">({tasks.length})</span>
          </h2>

          <div className="space-y-3 min-h-[200px]">
            {tasks.map((task, index) => (
              <KanbanTask
                key={task._id}
                task={task}
                index={index}
                statusColor={statusColors[status]}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                isDeleting={deletingTaskId === task._id}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && (
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
};

export default KanbanColumn;
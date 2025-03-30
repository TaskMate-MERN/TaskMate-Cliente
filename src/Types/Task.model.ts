// Definimos el tipo para el status de las tareas
export const TaskStatus = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    UNDER_REVIEW: 'Under Review',
    COMPLETED: 'Completed',
} as const;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

// Interface principal para la tarea (versión frontend)
export interface ITask {
    _id: string;  // Solo usamos string en el frontend
    title: string;
    status: TaskStatusType;
    description: string;
    project: string;  // Solo usamos string para el ID del proyecto
    createdAt?: string;  // Las fechas vienen como string desde el API
    updatedAt?: string;
}

// Tipos para crear y actualizar tareas
export interface CreateTaskData {
    title: string;
    status: TaskStatusType;
    description: string;
}

export interface UpdateTaskData extends CreateTaskData {}
export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    projectId: string;
    dueDate?: string;
    assignedTo?: string;
    priority?: "low" | "medium" | "high";
  }
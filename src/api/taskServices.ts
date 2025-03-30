import axios from "axios";
import { ITask, TaskStatus, TaskStatusType, CreateTaskData, UpdateTaskData } from "../Types/Task.model";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL02,
});

// Interceptor para token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const parsedToken = JSON.parse(token);
      config.headers.Authorization = `Bearer ${parsedToken.token || token}`;
    } catch {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
  
  export const TaskService = {
    // Crea una nueva tarea
    async createTask(projectID: string, taskData: CreateTaskData): Promise<ITask> {
      try {
        const response = await api.post(`/create-task/${projectID}`, taskData);
        return response.data;
      } catch (error) {
        console.error("Error creating task:", error);
        throw error;
      }
    },
  
    // Obtiene todas las tareas de un proyecto
    async getTasks(projectID: string): Promise<ITask[]> {
      try {
        const response = await api.get(`/get-tasks/${projectID}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
    },
  
    // Obtiene una tarea específica por ID
    async getTaskById(projectID: string, taskID: string): Promise<ITask> {
      try {
        const response = await api.get(`/get-task/${projectID}/${taskID}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
      }
    },
  
    // Actualiza una tarea
    async updateTask(
      projectID: string,
      taskID: string,
      taskData: UpdateTaskData
    ): Promise<ITask> {
      try {
        const response = await api.put(
          `/update-task/${projectID}/${taskID}`,
          taskData
        );
        return response.data;
      } catch (error) {
        console.error("Error updating task:", error);
        throw error;
      }
    },
  
    // Elimina una tarea
    async deleteTask(projectID: string, taskID: string): Promise<void> {
      try {
        await api.delete(`/delete-task/${projectID}/${taskID}`);
      } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
      }
    },
  
    // Métodos auxiliares para los status (sin cambios)
    getStatuses(): typeof TaskStatus {
      return TaskStatus;
    },
  
    isValidStatus(status: string): status is TaskStatusType {
      return Object.values(TaskStatus).includes(status as TaskStatusType);
    },
  };
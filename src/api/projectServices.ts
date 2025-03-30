import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL01,
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

// Operaciones de proyectos
export const projectService = {
  createProject: async (projectData: {
    title: string;
    client: string;
    description: string;
  }) => {
    const response = await api.post("/create-project", projectData);
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get("/get-projects");
    return response.data;
  },

  getProjectByID: async (projectID: string) => {
    const response = await api.get(`/get-project/${projectID}`);
    return response.data;
  },

  updateProject: async (projectID: string, updateData: {
    title?: string;
    client?: string;
    description?: string;
  }) => {
    // Asegurarse de que el ID no contenga "ObjectId()"
    const cleanId = projectID.includes("ObjectId('") ? 
      projectID.slice(9, -2) : 
      projectID;
    
    const response = await api.put(`/update-project/${cleanId}`, updateData);
    return response.data;
  },

  deleteProject: async (projectID: string) => {
    const cleanId = projectID.includes("ObjectId('") ? 
      projectID.slice(9, -2) : 
      projectID;
    
    const response = await api.patch(`/delete-project/${cleanId}`);
    return response.data;
  },

  recoverProject: async (projectID: string) => {
    const cleanId = projectID.includes("ObjectId('") ? 
      projectID.slice(9, -2) : 
      projectID;
    
    const response = await api.patch(`/recover-project/${cleanId}`);
    return response.data;
  }
};

// Nuevas funciones para manejo de miembros
export const findUserByEmail = async (email: string) => {
  try {
    const response = await api.get("/find-user", {
      params: { email },
     
    });
    return response.data;
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};

export const addMemberByID = async (projectID: string, userID: string) => {
  try {
      const response = await api.post(`/add-member/${projectID}`, { id: userID });
      return response.data;
  } catch (error) {
      console.error("Error adding member:", error);
      throw error;
  }
};

export const getMembers = async (projectID: string) => {
  try {
      const response = await api.get(`/get-members/${projectID}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
  }
};

export const deleteMemberByID = async (projectID: string, userID: string) => {
  try {
      const response = await api.delete(`/delete-member/${projectID}`, { data: { id: userID } });
      return response.data;
  } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
  }
};
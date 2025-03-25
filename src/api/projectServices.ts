// api.ts
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL01,
});

// Interceptor para agregar el token JWT a las solicitudes
api.interceptors.request.use((config) => {
    let token = localStorage.getItem("token");

    // Verificar si el token es JSON y extraerlo
    if (token) {
        try {
            const parsedToken = JSON.parse(token);
            token = parsedToken.token || token; // Si es un objeto, extraer solo el string
        } catch (error) {
            // Si no es JSON, asumir que ya es un string
        }
    }

    if (token && typeof token === "string") {
        console.log("Token enviado:", token); // Depuración
        config.headers["Authorization"] = `Bearer ${token}`;
    } else {
        console.error("No se encontró un token válido en localStorage");
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


// Crear un nuevo proyecto
export const createProject = async (projectData: {
    title: string;
    client: string;
    description: string;
}) => {
    const response = await api.post("/create-project", projectData);
    return response.data;
};

// Obtener todos los proyectos
export const getProjects = async () => {
    const response = await api.get("/get-projects");
    return response.data;
};

// Obtener un proyecto por ID
export const getProjectByID = async (projectID: string) => {
    const response = await api.get(`/get-project/${projectID}`);
    return response.data;
    
};


// Actualizar un proyecto
export const updateProject = async (projectID: string, updateData: {
    title?: string;
    client?: string;
    description?: string;
}) => {
    const response = await api.put(`/update-project/${projectID}`, updateData);
    return response.data;
};

// Eliminar un proyecto (cambiar su estado a false)
export const deleteProject = async (projectID: string) => {
    const response = await api.patch(`/delete-project/${projectID}`);
    return response.data;
};

// Recuperar un proyecto (cambiar su estado a true)
export const recoverProject = async (projectID: string) => {
    const response = await api.patch(`/recover-project/${projectID}`);
    return response.data;
};
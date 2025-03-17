import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Cambia localhost al dominio o IP cuando despliegues
});

// Agrega el token JWT al header de cada solicitud
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Recupera el token de localStorage
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Ejemplo: Llamadas específicas a tus rutas
export const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}) => {
    const response = await api.post("/create-user", userData);
    return response.data;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        const response = await api.post("/login", credentials);
        return response.data; // Asegúrate de devolver la respuesta correctamente
    } catch (error) {
        throw error; // Propaga el error para manejarlo en el componente
    }
};
export const requestAuthToken = async (email: string) => {
    const response = await api.post("/request-auth-token", { email });
    return response.data;
};

export const requestPasswordChange = async (email: string) => {
    const response = await api.post("/request-password-change", { email });
    return response.data;
};

export const confirmUser = async (token: string) => {
    const response = await api.post("/confirm-user", { token });
    return response.data;
};

export const confirmPasswordToken = async (token: string) => {
    const response = await api.post("/confirm-password-token", { token });
    return response.data;
};

export const changePassword = async (data: { token: string; password: string; confirm_password: string }) => {
    const response = await api.post("/change-password", data);
    return response.data;
};

export const fetchProjects = async () => {
    const response = await api.get("/project");
    return response.data;
};

export const fetchTasks = async (projectId: string) => {
    const response = await api.get(`/task/${projectId}`);
    return response.data;
};
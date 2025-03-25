import { useState, useEffect } from "react";
import { createProject, getProjects } from "../../../api/projectServices";
import Dashboard from "../../Dashboard/Dashboard";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para la navegación

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", client: "", description: "" });
  const navigate = useNavigate(); // Hook para navegación

  // Cargar proyectos al montar el componente
  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error al obtener los proyectos:", error);
      }
    }
    fetchProjects();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // Crear un nuevo proyecto
  const handleCreateProject = async () => {
    try {
      const createdProject = await createProject(newProject);
      setProjects([...projects, createdProject]); // Esto ya está correcto
      setShowForm(false);
      setNewProject({ title: "", client: "", description: "" });
      
      // Opcional: Recargar los proyectos desde el servidor para mayor consistencia
      const updatedProjects = await getProjects();
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
    }
  };

  // Navegar a la página de detalle del proyecto
  const handleViewProject = (project: Project) => {
    navigate('/workspace', { 
      state: { 
        currentProject: project 
      } 
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-purple-900 mb-4">My Projects</h1>
      
      <button 
        className="bg-purple-600 text-white px-4 py-2 rounded-full"
        onClick={() => setShowForm(true)}
      >
        New Project
      </button>

      {showForm && (
        <div className="mt-4 p-4 border rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-bold">Crear Proyecto</h2>
          <input 
            type="text" 
            name="title" 
            placeholder="Título" 
            className="border p-2 w-full mt-2"
            value={newProject.title}
            onChange={handleChange}
          />
          <input 
            type="text" 
            name="client" 
            placeholder="Cliente" 
            className="border p-2 w-full mt-2"
            value={newProject.client}
            onChange={handleChange}
          />
          <textarea 
            name="description" 
            placeholder="Descripción" 
            className="border p-2 w-full mt-2"
            value={newProject.description}
            onChange={handleChange}
          />
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            onClick={handleCreateProject}
          >
            Guardar
          </button>
        </div>
      )}

      {projects.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-bold">{project.title}</h2>
              <p className="text-gray-600">{project.client}</p>
              <p className="text-gray-500 mt-2 line-clamp-2">{project.description}</p>
              <button
  onClick={() => handleViewProject(project)}
  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
>
  Ver Proyecto
</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="mt-4 text-lg text-gray-700">
            No hay proyectos{" "}
            <a href="#" className="text-blue-600 font-bold" onClick={() => setShowForm(true)}>
              ¿Crear Proyecto?
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
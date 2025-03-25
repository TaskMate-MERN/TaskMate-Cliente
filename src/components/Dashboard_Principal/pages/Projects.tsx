import { useState, useEffect } from "react";
import { createProject, getProjects } from "../../../api/projectServices"; // Importar las funciones del servicio

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
      setProjects([...projects, createdProject]); // Agregar a la lista
      setShowForm(false); // Ocultar el formulario
      setNewProject({ title: "", client: "", description: "" }); // Reiniciar el formulario
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-purple-900">My Projects</h1>
      
      <button 
        className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
        onClick={() => setShowForm(true)}
      >
        New Project
      </button>

      {showForm && (
        <div className="mt-4 p-4 border rounded shadow-lg bg-white">
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
        <div className="mt-6">
          {projects.map((project) => (
            <div key={project.id} className="p-4 border-b">
              <h2 className="text-lg font-bold">{project.title}</h2>
              <p>{project.client}</p>
              <p>{project.description}</p>
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

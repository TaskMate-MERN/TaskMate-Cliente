import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../../../api/projectServices";
import { getProfile } from "../../../api/apiUsers";

interface Project {
  _id: string;
  title: string;
  client: string;
  description: string;
  status: boolean;
  manager?: string;
  tasks?: string[];
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
}

type TabType = 'active' | 'inactive';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ 
    title: "", 
    client: "", 
    description: "" 
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    client: "",
    description: ""
  });
  // Nuevo estado para almacenar el ID del usuario actual
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const navigate = useNavigate();

  // Cargar proyectos y filtrar según pestaña activa
  useEffect(() => {
    loadProjects();
    // Cargar el perfil del usuario para obtener su ID
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setCurrentUserId(profile._id);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, activeTab]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    setFilteredProjects(
      activeTab === 'active' 
        ? projects.filter(project => project.status)
        : projects.filter(project => !project.status)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingId) {
      setEditData(prev => ({ ...prev, [name]: value }));
    } else {
      setNewProject(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateProject = async () => {
    try {
      await projectService.createProject(newProject);
      await loadProjects();
      setShowForm(false);
      setNewProject({ title: "", client: "", description: "" });
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    }
  };

  const prepareEdit = (project: Project) => {
    setEditingId(project._id);
    setEditData({
      title: project.title,
      client: project.client,
      description: project.description
    });
  };

  const handleEditProject = async () => {
    if (!editingId) return;
    
    try {
      await projectService.updateProject(editingId, editData);
      await loadProjects();
      setEditingId(null);
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    }
  };

  const handleToggleStatus = async (projectId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await projectService.deleteProject(projectId);
      } else {
        await projectService.recoverProject(projectId);
      }
      setProjects(prev => prev.map(project => 
        project._id === projectId 
          ? { ...project, status: !currentStatus } 
          : project
      ));
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setProjects(prev => prev.map(project => 
        project._id === projectId 
          ? { ...project, status: currentStatus } 
          : project
      ));
    }
  };

  const handleViewProject = (project: Project) => {
    navigate('/workspace', { state: { currentProject: project } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header estilo Trello */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
        {activeTab === 'active' && (
          <button 
            onClick={() => setShowForm(true)}
            disabled={!!editingId}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + New Project
          </button>
        )}
      </div>

      {/* Pestañas estilo Trello */}
      <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-inner mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
            activeTab === 'active'
              ? 'bg-blue-100 text-blue-600 shadow-sm'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Active Projects
        </button>
        <button
          onClick={() => setActiveTab('inactive')}
          className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
            activeTab === 'inactive'
              ? 'bg-blue-100 text-blue-600 shadow-sm'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Inactive Projects
        </button>
      </div>

      {/* Formularios modales */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input 
                  type="text" 
                  name="title" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProject.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client*</label>
                <input 
                  type="text" 
                  name="client" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProject.client}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea 
                  name="description" 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProject.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateProject}
                  disabled={!newProject.title || !newProject.client || !newProject.description}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input 
                  type="text" 
                  name="title" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client*</label>
                <input 
                  type="text" 
                  name="client" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editData.client}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea 
                  name="description" 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditProject}
                  disabled={!editData.title || !editData.client || !editData.description}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tablero estilo Trello */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProjects.map((project) => (
            <div 
              key={project._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className={`h-2 ${project.status ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{project.title}</h2>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status ? 'Active' : 'Inactive'}
                    </span>
                    {project.manager === currentUserId && (
                      <span className="text-xs mt-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        Manager
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Client: {project.client}</p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                  {project.description || "No description provided"}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {/* Solo mostrar el botón View si el proyecto está activo */}
                  {project.status && (
                    <button
                      onClick={() => handleViewProject(project)}
                      className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded transition-colors"
                    >
                      View
                    </button>
                  )}
                  
                  {activeTab === 'active' && project.manager === currentUserId && (
                    <button
                      onClick={() => prepareEdit(project)}
                      className="text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-3 py-1 rounded transition-colors"
                      disabled={!!editingId}
                    >
                      Edit
                    </button>
                  )}
                  
                  {/* Solo mostrar el botón de desactivar/activar si el usuario es el manager */}
                  {project.manager === currentUserId && (
                    <button
                      onClick={() => handleToggleStatus(project._id, project.status)}
                      className={`text-sm px-3 py-1 rounded transition-colors ${
                        project.status 
                          ? "bg-red-50 hover:bg-red-100 text-red-600" 
                          : "bg-green-50 hover:bg-green-100 text-green-600"
                      }`}
                      disabled={!!editingId}
                    >
                      {project.status ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No {activeTab} projects</h3>
          <p className="mt-2 text-gray-500">
            {activeTab === 'active' 
              ? "Get started by creating a new project" 
              : "All projects are currently active"}
          </p>
          {activeTab === 'active' && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Project
            </button>
          )}
        </div>
      )}
    </div>
  );
}
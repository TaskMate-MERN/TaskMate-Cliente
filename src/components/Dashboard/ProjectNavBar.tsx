import React, { useEffect, useState } from "react";
import { getProfile } from "../../api/apiUsers";

interface Project {
  _id: string;
  title: string;
  client: string;
  description: string;
  createdAt?: string;
  manager?: string;
  status?: boolean;
}

interface UserProfile {
  name: string;
  email: string;
}

interface ProjectNavbarProps {
  project?: Project | null;
}

const ProjectNavbar: React.FC<ProjectNavbarProps> = ({ project }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <nav className="bg-sky-500 text-white flex justify-between items-center px-6 py-3 w-full shadow-md">
      {/* Contenedor izquierdo - título y cliente */}
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold relative group">
          <span className="relative z-10">
       {project?.title || "Selecciona un proyecto"}
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full"></span>
        </div>
        
        {project?.client && (
  <span className="text-white font-medium text-base px-5 py-1.5 ml-6 flex items-center gap-2">
    <span className="text-xl motion-safe:animate-[bounce_1s_infinite]">👔</span>
    <span className="font-normal">
      Cliente: <span className="font-medium">{project.client}</span>
    </span>
  </span>
)} </div>

      {/* Contenedor derecho - nombre de usuario y botones */}
      <div className="flex items-center gap-4">
        {userProfile?.name && (
          <span className="text-white font-medium bg-sky-600/20 px-3 py-1 rounded-lg">
            {userProfile.name}
          </span>
        )}

      </div>
    </nav>
  );
};

export default ProjectNavbar;
// components/Kanban/MembersModal.tsx
import React, { useState, useEffect } from "react";
import { IMember } from "../../Types/Members.model";
import { findUserByEmail, addMemberByID, getMembers, deleteMemberByID } from "../../api/projectServices";

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const MembersModal: React.FC<MembersModalProps> = ({ isOpen, onClose, projectId }) => {
  const [members, setMembers] = useState<IMember[]>([]);
  const [email, setEmail] = useState("");
  const [searchResults, setSearchResults] = useState<IMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && projectId) {
      loadMembers();
    }
  }, [isOpen, projectId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const membersData = await getMembers(projectId);
      setMembers(membersData);
    } catch (err) {
      setError("Error al cargar miembros");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSearch = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await findUserByEmail(email);
      setSearchResults(user);
    } catch (err) {
      setError("Usuario no encontrado o error en la búsqueda");
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    try {
      setLoading(true);
      await addMemberByID(projectId, userId);
      await loadMembers();
      setSearchResults(null);
      setEmail("");
    } catch (err) {
      setError("Error al agregar miembro");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      setLoading(true);
      await deleteMemberByID(projectId, userId);
      await loadMembers();
    } catch (err) {
      setError("Error al eliminar miembro");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Gestión de Miembros</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Buscar usuario por email</label>
          <div className="flex gap-2">
            <input
              type="email"
              className="flex-1 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese email"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              Buscar
            </button>
          </div>
        </div>

        {searchResults && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{searchResults.name}</h3>
                <p className="text-sm text-gray-600">{searchResults.email}</p>
              </div>
              <button
                onClick={() => handleAddMember(searchResults._id)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                disabled={loading}
              >
                Agregar
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-medium mb-2">Miembros del proyecto</h3>
          {loading && members.length === 0 ? (
            <p>Cargando...</p>
          ) : (
            <ul className="space-y-2">
              {members.map((member) => (
                <li key={member._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembersModal;
export default function Projects() {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-purple-900">My Proyects</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded mt-4">New Proyect</button>
        <div className="flex flex-col items-center justify-center h-screen">
      <p className="mt-4 text-lg text-gray-700">
           No hay proyectos{" "}
          <a href="#" className="text-blue-600 font-bold">Crear Proyecto?</a>
      </p>
      </div>

      </div>
    );
  }
  
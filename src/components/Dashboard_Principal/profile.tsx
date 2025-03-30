import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ProfileSettings from "./pages/profile";

function Dashboard() {
    const navigate = useNavigate();

    // Verificar si el usuario está autenticado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirige al login si no hay token
        }
    }, [navigate]);

    return (
        <div>
            <Navbar />
            <ProfileSettings />
        </div>
    );
}

export default Dashboard;
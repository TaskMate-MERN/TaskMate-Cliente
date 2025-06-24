import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Projects from "./pages/Projects";
import TermsModal from "./pages/TermsModal"; // Asegúrate de tener la ruta correcta

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div>
            <TermsModal />
            <Navbar />
            <Projects />
        </div>
    );
}

export default Dashboard;

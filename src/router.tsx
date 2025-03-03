import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthLayout, MainLayout } from "./layouts"
import { ProjectsView } from "./views/main";
import { LoginView } from "./views/admin";
import Login from "./components/admin/Login/Login";
import Dashboard from "./components/Dashboar/dashboard";

const router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLayout />}>
                    {/* Aqui pondran todas sus rutas del Login, Register, etc... */}
                    <Route index element={<LoginView />} />
                    <Route path="login" element={<Login />} />

                </Route>

                <Route path="/" element={<MainLayout />}>
                    {/* Aquí pondran todas las rutas de la app, como las vistas de los proyectos, tareas, etc... */}
                    <Route index element={<ProjectsView />} />
                </Route>
                
 {/* Rutas protegidas dentro del dashboard */}
                <Route path="/"element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default router;

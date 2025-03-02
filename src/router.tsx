import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthLayout, MainLayout } from "./layouts"
import { ProjectsView } from "./views/main";
import { LoginView } from "./views/admin";
import Login from "./components/Login/Login";

const router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthLayout />}>
                    {/* Aqui pondran todas sus rutas del Login, Register, etc... */}
                    <Route index element={<LoginView />} />

                    <Route path="login" element={<Login />} />

                </Route>

                <Route path="/" element={<MainLayout />}>
                    {/* Aquí pondran todas las rutas de la app, como las vistas de los proyectos, tareas, etc... */}
                    <Route index element={<ProjectsView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default router;

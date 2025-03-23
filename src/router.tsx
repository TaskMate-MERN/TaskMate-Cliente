import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthLayout, MainLayout } from "./layouts"
import Login from "./components/admin/Login/Login";
import TheDashboard from "./components/Dashboard/Dashboard";
import TestApiComponent from "./components/testApi/testApiComponent";

const router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthLayout />}>
                    {/* Aqui pondran todas sus rutas del Login, Register, etc... */}
                    <Route index element={<Login />} />

                    <Route path="test-api" element={<TestApiComponent />} />


                </Route>

                <Route path="/" element={<MainLayout />}>
                    {/* Aquí pondran todas las rutas de la app, como las vistas de los proyectos, tareas, etc... */}
                    <Route index element={<TheDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default router;

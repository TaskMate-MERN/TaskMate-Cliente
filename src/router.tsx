import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthLayout, MainLayout } from "./layouts"
import Login from "./components/admin/Login/Login";
import TheDashboard from "./components/Dashboard/Dashboard";
import Dashboard from "./components/Dashboard_Principal/dashboard";
import CreateUser from "./components/CreateUser/create_user";


const router = () => {
    return (
        <BrowserRouter>
            <Routes> 

                <Route path="/login" element={<AuthLayout />}>
                    {/* Aqui pondran todas sus rutas del Login, Register, etc... */}
                    <Route index element={<Login />} />
                </Route>

                <Route path="/dash" element={<AuthLayout />}>
                    {/* Aqui pondran todas sus rutas del Login, Register, etc... */}
                    <Route index element={<Dashboard />} />
                </Route>

                 <Route path="/Create" element={<AuthLayout />}>
                    {/* Aqui pondran todas sus rutas del Login, Register, etc... */}
                    <Route index element={<CreateUser />} />
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

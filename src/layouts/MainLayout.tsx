import { Outlet } from "react-router-dom"

export const MainLayout = () => {
    return (
        <>
            <h1>Cabecera del MAIN</h1>

            <Outlet />
        </>
    )
}

import { Outlet } from "react-router-dom"

export const AuthLayout = () => {
    return (
        <>
            <h1>Cabecera del AUTH</h1>

            <Outlet />
        </>
    )
}

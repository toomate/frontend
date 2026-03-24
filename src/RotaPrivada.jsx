import { Navigate, Outlet } from "react-router-dom";

function RotaPrivada() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />; // Aqui vai renderizar qualquer rota “filha”
}

export default RotaPrivada;
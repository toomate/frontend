import { Navigate, Outlet } from "react-router-dom";
import { lerRolesDoToken } from "./utils/sessao";

function RotaPrivada({ rolesPermitidas }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (rolesPermitidas?.length) {
        const rolesUsuario = lerRolesDoToken();
        const temPermissao = rolesPermitidas.some((role) => rolesUsuario.includes(role));
        if (!temPermissao) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
}

export default RotaPrivada;
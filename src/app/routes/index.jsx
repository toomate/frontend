import { Navigate, Route, Routes } from "react-router-dom";
import RotaPrivada from "../guards/RotaPrivada";
import Login from "../../features/auth/pages/Login";
import Cadastro from "../../features/auth/pages/Cadastro";
import Dashboard from "../../features/dashboard/pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<RotaPrivada />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import React from "react";
import { ArrowLeft } from "lucide-react";
import "./App.css";
import { useNavigate, useLocation } from "react-router-dom";
import HamburgerButton from "./components/HamburgerButton/HamburgerButton";
import { limparSessaoAutenticacao } from "./utils/sessao";

export default function HeaderPadrao() {
  const navigate = useNavigate();
  const location = useLocation();
  const nomeUsuarioLogado =
    localStorage.getItem("usuarioNomeCompleto") ||
    localStorage.getItem("usuarioNome") ||
    "Usuario";

  const estaNaDashboard = location.pathname === "/dashboard";

  function handleLogout() {
    limparSessaoAutenticacao();
    navigate("/");
  }

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <header className="header">
      <div className="lado-esquerdo">
        <HamburgerButton size={24} color="#6b4423" className="header-hamburguer-btn" />

        <div className="logo-circulo"></div>

        <div className="restaurante">
          <div className="restaurante-name">Toomate Bistrô</div>
          <div className="restaurante-subnome">{nomeUsuarioLogado}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {estaNaDashboard ? (
          <button onClick={handleLogout} className="btn">
            Sair
          </button>
        ) : (
          <button onClick={handleBack} className="btn">
            <ArrowLeft size={18} /> Voltar
          </button>
        )}
      </div>
    </header>
  );
}

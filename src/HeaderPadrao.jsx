import React from "react";
import { Menu } from "lucide-react";
import "./App.css";
import { useNavigate } from "react-router-dom";

export default function HeaderPadrao() {
  const navigate = useNavigate();

  function handleLogout() {
    // aqui você pode limpar token, localStorage, etc futuramente
    // localStorage.removeItem("token");

    navigate("/"); // volta para tela de login
  }

  return (
    <header className="header">
      <div className="lado-esquerdo">
        <button className="hamburger-btn">
          <Menu size={28} color="#b88b09" />
        </button>

        <div className="logo-circulo"></div>

        <div className="restaurante">
          <div className="restaurante-name">Toomate Bistrô</div>
          <div className="restaurante-subnome">Kaio</div>
        </div>
      </div>

      <button onClick={handleLogout} className="btn">
        Sair
      </button>
    </header>
  );
}
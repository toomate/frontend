import React from "react";
import { Menu, ArrowLeft } from "lucide-react";
import "./App.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function HeaderPadrao() {
  const navigate = useNavigate();
  const location = useLocation();

  const estaNaDashboard = location.pathname === "/dashboard";

  function handleLogout() {
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
        <button className="hamburger-btn">
          <Menu size={28} color="#b88b09" />
        </button>

        <div className="logo-circulo"></div>

        <div className="restaurante">
          <div className="restaurante-name">Toomate Bistrô</div>
          <div className="restaurante-subnome">Kaio</div>
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
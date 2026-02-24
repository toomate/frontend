import React from "react";
import { Menu } from "lucide-react";
import "./index.css";

export default function HeaderPadrao({ irPara }) {
  return (
      <header className="header">
        <div className="lado-esquerdo">
          <button className="hamburger-btn">
            <Menu size={28} color="#b88b09"/>
          </button>

          <div className="logo-circulo"></div>

          <div className="restaurante">
            <div className="restaurante-name">Toomate Bistrô</div>
            <div className="restaurante-subnome">Kaio</div>
          </div>
        </div>
          
        <button onClick={() => irPara("login")} className="btn">Sair</button>
      </header>
  )
}
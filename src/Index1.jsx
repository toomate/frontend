import React from "react";
import "./index1.css";
import { Menu } from "lucide-react";
import "./index1.css";

export default function Index1({ irPara }) {
  return (
    <div className="dashboard">
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

      <nav className="menu">
        <button>Estoque</button>
        <button>Fornecedores</button>
        <button>Gastos</button>
        <button>Boletos</button>
        <button>Fiados</button>
      </nav>

      <div className="status">
        <div className="card">
          <span>Produtos Abaixo do Estoque Min.</span>
          <span className="numero">8</span>
        </div>
        <div className="card">
          <span>Produtos Perto da Data de Vencimento</span>
          <span className="numero">12</span>
        </div>
        <div className="card">
          <span>Boletos próximos ao Vencimento</span>
          <span className="numero">4</span>
        </div>
        <div className="card">
          <span>Total de clientes devedores</span>
          <span className="numero">25</span>
        </div>
      </div>

      <div className="container2">
        <div className="grafico">
        </div>

      <div className="notificacao">
        <h2 className="alerta-titulo">ALERTAS!</h2>

        <button className="alerta-btn validade">
          <span className="validade-icone"></span>
          <span>Notificação de Validade!</span> 
        </button>

        <button className="alerta-btn estoque">
          <span className="estoque-icone"></span>
          <span>Notificação de Estoque!</span> 
        </button>

        <button className="alerta-btn fornecedor">
          <span className="fornecedor-icone"></span>
          <span>Notificação de Fornecedor!</span> 
        </button>

        <button className="alerta-btn boleto">
          <span className="boleto-icone"></span>
          <span>Notificação de Boleto!</span> 
        </button>
      </div>
      </div>
    </div>
  );
}
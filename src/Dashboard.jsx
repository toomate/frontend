import React from "react";
import { Menu } from "lucide-react";
import "./index.css";
import { Navbar } from "./components/Navbar/Navbar";
import HeaderPadrao from "./HeaderPadrao";

export default function Index({ irPara }) {
  return (
    <div className="dashboard">
      <HeaderPadrao/>

      <nav className="menu">
        <button onClick={() => irPara("Estoque")} className="btn">Estoque</button>
        <button onClick={() => irPara("Fornecedores")} className="btn">Fornecedores</button>
        <button onClick={() => irPara("Gastos")} className="btn">Gastos</button>
        <button onClick={() => irPara("Boletos")} className="btn">Boletos</button>
        <button onClick={() => irPara("Fiados")} className="btn">Fiados</button>
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
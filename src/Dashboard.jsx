import React from "react";
import "./App.css";
import HeaderPadrao from "./HeaderPadrao";
import { useNavigate } from "react-router-dom";
import Kpi from "./components/Kpi/Kpi";

export default function Index() {
  const navigate = useNavigate();
  const cards = [{
    nome: "Produtos Abaixo do Estoque Min.",
    valor: 8
  },
  {
    nome: "Produtos Perto da Data de Vencimento",
    valor: 12
  },
  {
    nome: "Boletos Próximo ao Vencimento",
    valor: 4
  },
  {
    nome: "Total de Clientes Devedores",
    valor: 25
  }
  ]
  return (
    <div className="dashboard">
      <HeaderPadrao />

      <nav className="menu">
        <button onClick={() => navigate("/estoque")} className="btn">Estoque</button>
        <button onClick={() => navigate("/Gastos")} className="btn">Gastos</button>
        <button onClick={() => navigate("/fornecedor")} className="btn">Fornecedores</button>
        <button onClick={() => navigate("/Boletos")} className="btn">Boletos</button>
        <button onClick={() => navigate("/Fiados")} className="btn">Fiados</button>
        <button onClick={() => navigate("/Vencimentos")} className="btn">Vencimentos</button>
      </nav>

      <Kpi kpis={cards}/>

      <div className="container2">
        <div className="grafico"></div>

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


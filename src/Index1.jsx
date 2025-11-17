import React from 'react';
import './index1.css';

export default function Index1() {
  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo-circle"></div>

        <div className="restaurant-info">
          <div className="restaurant-name">Toomate</div>
          <div className="restaurant-sub">Informações adicionais</div>
        </div>

        <div className="user-circle"></div>
      </header>

      <nav className="menu">
        <button>Estoque</button>
        <button>Fornecedores</button>
        <button>Boletos</button>
        <button>Fiados</button>
      </nav>

      <div className="stats">
        <div className="card">Qtd. de produtos abaixo do estoque mínimo</div>
        <div className="card">Qtd. de produtos perto da data de validade</div>
        <div className="card">Qtd. de boletos próximos do vencimento</div>
        <div className="card">Qtd. total de clientes devedores</div>
      </div>

      <div className="content">
        <div className="chart">
          {/* <p>[ Gráfico ilustrativo aqui ]</p> */}
        </div>

        <div className="notifications">
          <p><strong>Últimas notificações </strong><br /> Contas a vencer / Alertas de estoque</p>
          <button className="alerta-btn">Alertas de Estoque</button>
          <button className="alerta-btn">Alertas de Boleto</button>
          <button className="alerta-btn">Alertas de Validade</button>
        </div>
      </div>
    </div>
  );
}

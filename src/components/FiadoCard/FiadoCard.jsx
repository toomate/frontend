import React from "react";
import "./FiadoCard.css";

export function FiadoCard({ fiado, onAbrir }) {
  return (
    <div className="fiado-card">
      <div className="fiado-card-nome">
        <span className="label">Nome:</span>
        <span className="valor-bar">{fiado.nome}</span>
      </div>

      <div className="fiado-card-info">
        <div className="info-group">
          <span className="label">Valor Total:</span>
          <span className="valor-bar">
            R$ {Number(fiado.valorTotal).toFixed(2)}
          </span>
        </div>
        <div className="info-group">
          <span className="label">Contato:</span>
          <span className="valor-bar">{fiado.contato}</span>
        </div>
      </div>

      <div className="fiado-card-pedidos">
        <span className="label">Descrição da compra</span>
        <button className="fiado-card-abrir-btn" onClick={() => onAbrir(fiado)}>
          Abrir
        </button>
      </div>
    </div>
  );
}

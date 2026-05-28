import React from "react";
import "./FiadoCard.css";

export function FiadoCard({ fiado, onAbrir }) {
  const totalAberto = fiado.dividas
    .filter((d) => !d.pago)
    .reduce((acc, d) => acc + Number(d.valor), 0);

  const todasPagas = fiado.dividas.length > 0 && fiado.dividas.every((d) => d.pago);

  return (
    <div className="fiado-card">
      <div className="fiado-card-nome">
        <span className="valor-bar">{fiado.nome}</span>
      </div>

      <div className="fiado-card-info">
        <div className="info-group info-group-valor-total">
          <span className="label">Valor Total:</span>
          <span className="valor-bar">
            R$ {totalAberto.toFixed(2)}
          </span>
        </div>
        <div className="info-group info-group-status">
          <span className="label">Status:</span>
          <span className={`status-badge ${todasPagas ? "pago" : "aberto"}`}>
            {todasPagas ? "Pago" : "Em aberto"}
          </span>
        </div>
      </div>

      <div className="fiado-card-pedidos">
        <div className="fiado-card-telefone">
          <span className="label">Telefone:</span>
          <span className="valor-bar telefone-bar">{fiado.telefone}</span>
        </div>
        <button className="fiado-card-abrir-btn" onClick={() => onAbrir(fiado)}>
          Abrir
        </button>
      </div>
    </div>
  );
}

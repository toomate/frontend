import React from "react";
import { X } from "lucide-react";
import "./FiadoModal.css";

export function FiadoModal({ fiado, onClose }) {
  if (!fiado) return null;

  return (
    <div className="fiado-modal-overlay" onClick={onClose}>
      <div className="fiado-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="fiado-modal-header">
          <button className="fiado-modal-close" onClick={onClose}>
            <X size={24} color="#000" />
          </button>

          <div className="fiado-modal-row">
            <span className="label">Nome:</span>
            <span className="valor-bar wide">{fiado.nome}</span>
          </div>

          <div className="fiado-modal-row">
            <span className="label">Valor Total:</span>
            <span className="valor-bar">
              R$ {Number(fiado.valorTotal).toFixed(2)}
            </span>
            <span className="label">Contato:</span>
            <span className="valor-bar">{fiado.contato}</span>
          </div>

          <div className="fiado-modal-row">
            <span className="label">Endereço:</span>
            <span className="valor-bar wide">{fiado.endereco || "—"}</span>
          </div>
        </div>

        {/* Body - Tabela de pedidos */}
        <div className="fiado-modal-body">
          <div className="fiado-modal-table-header">
            <span>Pedido</span>
            <span>Valor</span>
            <span>Data</span>
          </div>

          {fiado.pedidos && fiado.pedidos.length > 0 ? (
            fiado.pedidos.map((pedido, index) => (
              <div className="fiado-modal-pedido-row" key={index}>
                <span>{pedido.descricao}</span>
                <span>R$ {Number(pedido.valor).toFixed(2)}</span>
                <span>{pedido.data}</span>
              </div>
            ))
          ) : (
            <div className="fiado-modal-vazio">
              Nenhum pedido registrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

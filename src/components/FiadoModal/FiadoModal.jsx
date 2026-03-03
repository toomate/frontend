import React from "react";
import { X } from "lucide-react";
import "./FiadoModal.css";

export function FiadoModal({ fiado, onClose, onPagarDivida, onPagarTodas }) {
  if (!fiado) return null;

  const totalAberto = fiado.dividas
    .filter((d) => !d.pago)
    .reduce((acc, d) => acc + Number(d.valor), 0);

  const totalPago = fiado.dividas
    .filter((d) => d.pago)
    .reduce((acc, d) => acc + Number(d.valor), 0);

  const todasPagas = fiado.dividas.length > 0 && fiado.dividas.every((d) => d.pago);

  const formatarData = (dataStr) => {
    if (!dataStr) return "—";
    const d = new Date(dataStr);
    if (isNaN(d.getTime())) return dataStr;
    return d.toLocaleDateString("pt-BR");
  };

  return (
    <div className="fiado-modal-overlay" onClick={onClose}>
      <div className="fiado-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="fiado-modal-header">
          <button className="fiado-modal-close" onClick={onClose}>
            <X size={24} color="#6b4423" />
          </button>

          <div className="fiado-modal-row">
            <span className="label">Nome:</span>
            <span className="valor-bar wide">{fiado.nome}</span>
          </div>

          <div className="fiado-modal-row">
            <span className="label">Telefone:</span>
            <span className="valor-bar">{fiado.telefone || "—"}</span>
            <span className="label">Bairro:</span>
            <span className="valor-bar">{fiado.bairro || "—"}</span>
          </div>

          <div className="fiado-modal-row">
            <span className="label">Logradouro:</span>
            <span className="valor-bar wide">
              {fiado.logradouro || "—"}
              {fiado.cep ? ` — CEP: ${fiado.cep}` : ""}
            </span>
          </div>
        </div>

        {/* Body - Tabela de dívidas */}
        <div className="fiado-modal-body">
          <div className="fiado-modal-table-header">
            <span>Pedido</span>
            <span>Valor</span>
            <span>Data Compra</span>
            <span>Status</span>
          </div>

          {fiado.dividas && fiado.dividas.length > 0 ? (
            fiado.dividas.map((divida) => (
              <div
                className={`fiado-modal-pedido-row ${divida.pago ? "pago" : ""}`}
                key={divida.idDivida}
              >
                <span>{divida.pedido}</span>
                <span>R$ {Number(divida.valor).toFixed(2)}</span>
                <span>{formatarData(divida.dataCompra)}</span>
                <span>
                  <button
                    className={`btn-pagar-divida ${divida.pago ? "pago" : "aberto"}`}
                    onClick={() => !divida.pago && onPagarDivida(fiado.idCliente, divida.idDivida)}
                    disabled={divida.pago}
                  >
                    {divida.pago
                      ? `Pago ${divida.dataPagamento ? formatarData(divida.dataPagamento) : ""}`
                      : "Marcar pago"}
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div className="fiado-modal-vazio">
              Nenhuma dívida registrada
            </div>
          )}
        </div>

        {/* Footer com totais */}
        <div className="fiado-modal-footer">
          <div className="total-info">
            <span>
              Em aberto: <strong className="valor-aberto">R$ {totalAberto.toFixed(2)}</strong>
            </span>
            <span>
              Pago: <strong className="valor-pago">R$ {totalPago.toFixed(2)}</strong>
            </span>
          </div>
          <button
            className="btn-pagar-todas"
            onClick={() => onPagarTodas(fiado.idCliente)}
            disabled={todasPagas || fiado.dividas.length === 0}
          >
            {todasPagas ? "Tudo pago" : "Pagar todas"}
          </button>
        </div>
      </div>
    </div>
  );
}

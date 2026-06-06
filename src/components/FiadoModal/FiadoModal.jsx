import React, { useState } from "react";
import { X } from "lucide-react";
import "./FiadoModal.css";

export function FiadoModal({ fiado, onClose, onPagarDivida, onDesfazerPagamento, onPagarTodas }) {
  if (!fiado) return null;

  const [modalComprovante, setModalComprovante] = useState(false);
  const [dividaSelecionada, setDividaSelecionada] = useState(null);
  const [comprovante, setComprovante] = useState(null);
  const [documento, setDocumento] = useState("");

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

  const abrirModalPagamento = (divida) => {
    setDividaSelecionada(divida);
    setComprovante(null);
    setDocumento("");
    setModalComprovante(true);
  };

  const confirmarPagamento = async () => {
    if (!comprovante) {
      alert("Insira o comprovante.");
      return;
    }

    if (!documento.trim()) {
      alert("Insira o documento.");
      return;
    }

    await onPagarDivida(fiado.idCliente, dividaSelecionada.idDivida, {
      comprovante,
      documento,
    });

    setModalComprovante(false);
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
                  onClick={() =>
                    divida.pago
                      ? onDesfazerPagamento(fiado.idCliente, divida.idDivida)
                      : abrirModalPagamento(divida)                  }
                >
                  {divida.pago
                    ? `Desfazer pagamento (${divida.dataPagamento ? formatarData(divida.dataPagamento) : ""})`
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

        {modalComprovante && (
        <div
          className="fiado-modal-overlay"
          onClick={() => setModalComprovante(false)}
        >
          <div
            className="fiado-modal comprovante-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Confirmar pagamento</h2>

            <div className="comprovante-form">
              <label>Comprovante</label>
              <input
                type="text"
                placeholder="Digite um nome para o comprovante"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              />

              <label>Comprovante (foto)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setComprovante(e.target.files[0])}
              />
            </div>

            <div className="comprovante-actions">
              <button
                className="btn-cancelar"
                onClick={() => setModalComprovante(false)}
              >
                Cancelar
              </button>

              <button
                className="btn-confirmar"
                onClick={confirmarPagamento}
              >
                Confirmar pagamento
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

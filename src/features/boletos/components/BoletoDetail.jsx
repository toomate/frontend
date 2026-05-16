import { useState } from 'react';
import './boletoDetail.css';
import { boletos as BoletosApi } from '../../../provider/Api';

export default function BoletoDetail({ boletos, onClose, onStatusAtualizado }){
  const [carregandoPorId, setCarregandoPorId] = useState({});
  const [erroPorId, setErroPorId] = useState({});
  const [comprovantePorId, setComprovantePorId] = useState({});

  console.log('Boletos recebidos em BoletoDetail:', boletos);

  async function marcarComoPago(boleto) {
    if (boleto.status || carregandoPorId[boleto.id]) {
      return;
    }

    setCarregandoPorId((estadoAtual) => ({
      ...estadoAtual,
      [boleto.id]: true,
    }));
    setErroPorId((estadoAtual) => ({
      ...estadoAtual,
      [boleto.id]: '',
    }));

    try {
      await BoletosApi.marcarComoPago(boleto.id);
      onStatusAtualizado?.(boleto.id, true);
    } catch (error) {
      console.error('Erro ao marcar boleto como pago:', error);
      setErroPorId((estadoAtual) => ({
        ...estadoAtual,
        [boleto.id]: 'Não foi possível atualizar o boleto.',
      }));
    } finally {
      setCarregandoPorId((estadoAtual) => ({
        ...estadoAtual,
        [boleto.id]: false,
      }));
    }
  }

  async function anexarComprovanteEAtualizarStatus(boleto, eventoArquivo) {
    const arquivo = eventoArquivo.target.files?.[0];

    if (!arquivo) {
      return;
    }

    setComprovantePorId((estadoAtual) => ({
      ...estadoAtual,
      [boleto.id]: arquivo.name,
    }));

    await marcarComoPago(boleto);
  }

  async function pagarComConfirmacaoSemComprovante(boleto) {
    const possuiComprovante = Boolean(comprovantePorId[boleto.id]);

    if (!possuiComprovante) {
      const confirmouSemComprovante = window.confirm(
        'Deseja confirmar o pagamento sem inserir comprovante?',
      );

      if (!confirmouSemComprovante) {
        return;
      }
    }

    await marcarComoPago(boleto);
  }

  async function desmarcarPagamento(boleto) {
    if (!boleto.status || carregandoPorId[boleto.id]) {
      return;
    }

    const confirmouDesmarcacao = window.confirm(
      'Deseja desmarcar este boleto como pago?',
    );

    if (!confirmouDesmarcacao) {
      return;
    }

    setCarregandoPorId((estadoAtual) => ({
      ...estadoAtual,
      [boleto.id]: true,
    }));
    setErroPorId((estadoAtual) => ({
      ...estadoAtual,
      [boleto.id]: '',
    }));

    try {
      await BoletosApi.desmarcarComoPago(boleto.id);
      onStatusAtualizado?.(boleto.id, false);

      setComprovantePorId((estadoAtual) => {
        const proximoEstado = { ...estadoAtual };
        delete proximoEstado[boleto.id];
        return proximoEstado;
      });
    } catch (error) {
      console.error('Erro ao desmarcar boleto como pago:', error);
      setErroPorId((estadoAtual) => ({
        ...estadoAtual,
        [boleto.id]: 'Não foi possível desmarcar o pagamento.',
      }));
    } finally {
      setCarregandoPorId((estadoAtual) => ({
        ...estadoAtual,
        [boleto.id]: false,
      }));
    }
  }

  return (
    <div className='detail-wrapper'>

      <button className="modal-close-inside" onClick={onClose}>
        ✕
      </button>

      {boletos.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Nenhum boleto encontrado.</p>
      ) : (
        boletos.map((boleto, index) => (
          <div className="event-item" key={index}>

            <div className="event-title">
              {boleto.title}
            </div>

            <div className="event-body">

              <div className="event-row">
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: boleto.status ? 'green' : 'red'
                  }}
                ></span>
                <span className="event-status">
                  {boleto.status ? 'Pago' : 'Pendente'}
                </span>
              </div>

              <div className="event-row event-value">
                Valor: {boleto.value}
              </div>

              <div className="event-row event-data">
                Vencimento:{' '}
                {new Date(boleto.end).toLocaleDateString('pt-BR')}
              </div>

              <div className="event-row event-actions">
                {boleto.status ? (
                  <div className="event-confirmacao-box">
                    <button
                      type="button"
                      className="event-action-button is-paid"
                      disabled
                    >
                      Pago ✓
                    </button>

                    <button
                      type="button"
                      className="event-action-button is-pending"
                      onClick={() => desmarcarPagamento(boleto)}
                      disabled={carregandoPorId[boleto.id]}
                    >
                      {carregandoPorId[boleto.id] ? 'Atualizando...' : 'Desmarcar pago'}
                    </button>
                  </div>
                ) : (
                  <div className="event-confirmacao-box">
                    <p className="event-confirmacao-texto">
                      Clique em pagar ou insira um comprovante para confirmar automaticamente o pagamento.
                    </p>

                    <div className="event-confirmacao-acoes">
                      <button
                        type="button"
                        className="event-action-button is-pending"
                        onClick={() => pagarComConfirmacaoSemComprovante(boleto)}
                        disabled={carregandoPorId[boleto.id]}
                      >
                        {carregandoPorId[boleto.id] ? 'Atualizando...' : 'Pagar'}
                      </button>

                      <label className="event-file-button" htmlFor={`comprovante-${boleto.id}`}>
                        Inserir comprovante
                      </label>
                      <input
                        id={`comprovante-${boleto.id}`}
                        type="file"
                        accept="image/*,.pdf"
                        className="event-file-input"
                        onChange={(eventoArquivo) => anexarComprovanteEAtualizarStatus(boleto, eventoArquivo)}
                        disabled={carregandoPorId[boleto.id]}
                      />
                    </div>

                    {comprovantePorId[boleto.id] && (
                      <span className="event-file-name">Comprovante: {comprovantePorId[boleto.id]}</span>
                    )}
                  </div>
                )}
                {erroPorId[boleto.id] && (
                  <span className="event-action-error">{erroPorId[boleto.id]}</span>
                )}
              </div>

            </div>

          </div>
        ))
      )}
    </div>
  );
}
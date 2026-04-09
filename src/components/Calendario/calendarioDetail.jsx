import { useState } from 'react';
import './calendarioDetail.css';
import { boletos as BoletosApi } from '../../provider/Api';

export default function CalendarioDetail({ boletos, onClose, onStatusAtualizado }){
  const [carregandoPorId, setCarregandoPorId] = useState({});
  const [erroPorId, setErroPorId] = useState({});

  console.log('Boletos recebidos em CalendarioDetail:', boletos);

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
                <button
                  type="button"
                  className={`event-action-button ${boleto.status ? 'is-paid' : 'is-pending'}`}
                  onClick={() => marcarComoPago(boleto)}
                  disabled={boleto.status || carregandoPorId[boleto.id]}
                >
                  {boleto.status
                    ? 'Pago ✓'
                    : carregandoPorId[boleto.id]
                    ? 'Atualizando...'
                    : 'Marcar como pago'}
                </button>
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
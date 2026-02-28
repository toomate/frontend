import { useLocation } from 'react-router-dom';
import './calendarioDetail.css';

export default function CalendarioDetail({ boletos, onClose }){

  console.log('Boletos recebidos em CalendarioDetail:', boletos);

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

            </div>

          </div>
        ))
      )}
    </div>
  );
}
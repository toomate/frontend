import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function CalendarioDetail() {
    const location = useLocation();
    const boleto = location.state;
    console.log('Boleto recebido em CalendarioDetail:', boleto);
  return (
  <div className="event-item">
    <span
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: boleto.status ? 'green' : 'red',
        marginRight: '5px'
      }}
    ></span>
    <span className="event-title">{boleto.title}</span><br></br>
    <span className="event-status">{boleto.status ? 'Pago' : 'Pendente'}</span><br></br>
    <span className="event-value">{boleto.value}</span><br></br>
    <span className="event-data">{boleto.end.toLocaleDateString('pt-BR')}</span><br></br>

  </div>
);
}
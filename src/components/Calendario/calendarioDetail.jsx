import { useState, useEffect } from 'react';

export default function CalendarioDetail(boleto) {
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
    <span className="event-title">{boleto.descricao}</span>
  </div>
);
}
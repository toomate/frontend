import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendario.css';
import CalendarioDetail from './calendarioDetail';
import { boletos } from '../../provider/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderPadrao from '../../HeaderPadrao';


export default function Calendario() {
  const [selectedBoletos, setSelectedBoletos] = useState([]);
  const location = useLocation();
  const myEventsList = location.state?.myEventsList || [];

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  function detalhar(id) {
    const boletosEncontrados = myEventsList.filter(
      (boleto) => boleto.id === id
    );

    if (boletosEncontrados.length > 0) {
      console.log('Boletos encontrados:', boletosEncontrados);
      setSelectedBoletos(boletosEncontrados);
    }
  }

  function detalharPorData(data) {
    const boletosDoDia = myEventsList.filter((boleto) => {
      const d1 = new Date(boleto.start);
      const d2 = new Date(data);

      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    });

    setSelectedBoletos(boletosDoDia);
  }

  moment.locale('pt-br');
  const localizer = momentLocalizer(moment);

  const EVENT_BG = '#C3C3C3';

  // Componente customizado para o evento
 const EventComponent = ({ event, allEvents }) => {

  const eventosDoDia = allEvents.filter((e) => {
    const d1 = new Date(e.start);
    const d2 = new Date(event.start);

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  });

  const eventosOrdenados = [...eventosDoDia].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  const ehPrimeiroDoDia = eventosOrdenados[0]?.id === event.id;

  if (isMobile) {
    if (!ehPrimeiroDoDia) return null;

    return (
      <div className="mobile-day-container">
        <button
          className="ver-dia-btn-mobile"
          onClick={() => detalharPorData(event.start)}
        >
          {eventosDoDia.length} boleto{eventosDoDia.length > 1 ? 's' : ''}
        </button>
      </div>
    );
  }

  const primeiraPalavra = event.title?.split(' ')[0];

  return (
    <div className="event-content">
      {eventosDoDia.length > 1 && ehPrimeiroDoDia && (
        <button
          className="ver-dia-btn"
          onClick={() => detalharPorData(event.start)}
        >
          Ver boletos do dia ({eventosDoDia.length})
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: event.status ? 'green' : 'red',
            marginRight: '5px'
          }}
        ></span>

        <span
          className="event"
          onClick={() => detalhar(event.id)}
        >
          {primeiraPalavra}
        </span>
      </div>
    </div>
  );
};


  const MyCalendar = ({ events }) => (

    <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month']}
        style={{ height: '100%' }}
        toolbar={false}
        components={{
          event: (props) => (
            <EventComponent
              {...props}
              allEvents={myEventsList}
            />
          ),
        }}
        eventPropGetter={() => {
          return {
            style: {
              backgroundColor: EVENT_BG,
              opacity: 1,
              color: 'black',
            },
          };
        }}
        dayPropGetter={(date) => {
          // Verifica se a data tem algum evento (comparando dia/mês/ano)
          const hasEvent = events.some(e => {
            const d = new Date(date);
            const s = new Date(e.start);
            return d.getFullYear() === s.getFullYear() && d.getMonth() === s.getMonth() && d.getDate() === s.getDate();
          });
          if (hasEvent) {
            return { style: { backgroundColor: EVENT_BG } };
          }
          return {};
        }}
      />
    </div>
  );

  return (
    <div className="calendario-container">
      <HeaderPadrao></HeaderPadrao>
      <div className="calendario-container-inside">
        <h1>Calendário de Pagamentos</h1>
        <MyCalendar events={myEventsList} />
      </div>
      {selectedBoletos.length > 0 && (
        <div className="modal-overlay">
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <CalendarioDetail
              boletos={selectedBoletos}
              onClose={() => setSelectedBoletos([])}
            />
          </div>
        </div>
      )}
    </div>
  );
}
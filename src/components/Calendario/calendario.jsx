import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendario.css';
import { boletos } from '../../provider/Api';
import { useLocation, useNavigate } from 'react-router-dom';


export default function Calendario() {
      const navigate = useNavigate();
function detalhar(id){
for (let boleto of myEventsList) {
  if (boleto.id === id) {
    console.log('Boleto encontrado:', [boleto]);
  navigate('/calendarioDetalhes', {state: [boleto]});
};
}
}
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

// Cor usada para eventos e células com eventos
const EVENT_BG = '#C3C3C3';

// Componente customizado para o evento
const EventComponent = ({ event }) => (
  <div className="event-content" style={{ display: 'flex', alignItems: 'center' }}>
    <span
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: event.status ? 'green' : 'red',
        marginRight: '5px'
      }}
    ></span>
    <span className="event" onClick={() => detalhar(event.id)}>{event.title}</span>
  </div>
);


const MyCalendar = ({ events }) => (
  // Usar listarBoletos para definir os events do calendário, convertendo os dados para o formato esperado pelo react-big-calendar

  <div style={{ height: '80vh' }}>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      views={['month']}
      style={{ height: '100%' }}
      toolbar={false}
      components={{
        event: EventComponent,
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
  const [myEventsList, setMyEventsList] = useState([]);
  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        const boletosData = await boletos.listarBoletos();
        console.log('Boletos da API:', boletosData);
        const events = Array.isArray(boletosData) ? boletosData.map(boleto => {
          const startDate = moment.utc(boleto.dataVencimento).startOf('day').toDate();
          console.log(`Boleto: ${boleto.descricao}, Data original: ${boleto.data_vencimento}, Data convertida: ${startDate}`);
          return {
            id: boleto.idBoleto,
            title: boleto.descricao,
            status: boleto.pago,
            value: `R$ ${boleto.valor.toFixed(2)}`,
            start: startDate,
            end: startDate,
          };
        }) : [];
        console.log('Events processados:', events);
        setMyEventsList(events);
      } catch (error) {
        console.error('Erro ao buscar boletos:', error);
        setMyEventsList([]);
      }
    };
    fetchBoletos();

  }, []);

  return (
    <div>
      <h1>Calendário</h1>
      <MyCalendar events={myEventsList} />
    </div>
  );
}
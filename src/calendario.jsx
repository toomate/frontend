import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendario.css';

const localizer = momentLocalizer(moment);

// Array de eventos exemplo
const myEventsList = [
  {
    id: 0,
    title: 'Nome Divida',
    value: 'R$ 100,00',
    start: new Date(2026, 1, 14, 10, 0),
    end: new Date(2026, 1, 14, 11, 0),
  },
];

// Cor usada para eventos e células com eventos
const EVENT_BG = '#C3C3C3';

// Componente customizado para o evento
const EventComponent = ({ event }) => (
  <div className="event-content">
    <p>Status da divida</p>
    <strong>{event.title}</strong>
    <p>{event.value}</p>
  </div>
);

const MyCalendar = props => (
  <div style={{ height: '80vh' }}>
    <Calendar
      localizer={localizer}
      events={myEventsList}
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
        const hasEvent = myEventsList.some(e => {
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

export default function Calendario() {
  return (
    <div>
      <h1>Calendário</h1>
      <MyCalendar />
    </div>
  );
}
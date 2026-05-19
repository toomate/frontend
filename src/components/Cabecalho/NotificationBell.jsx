import React, { useState } from "react";
import { useNotifications } from "../../utils/useNotification.js";
import "./NotificationBell.css";

export default function NotificationBell() {
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);

  // ✅ notifications já é array de objetos — só agrupar
  const groupedNotifications = notifications.reduce((acc, msg) => {
    const { id, timestamp, body } = msg;
    if (!acc[id]) acc[id] = [];
    acc[id].push({ timestamp, ...body });
    return acc;
  }, {});

  return (
    <div className="notif-container">
      <button className="notif-button" onClick={() => setOpen(!open)}>
        🔔
        {notifications.length > 0 && (
          <span className="notif-badge">{notifications.length}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <h4>Notificações</h4>

          {Object.keys(groupedNotifications).length === 0 && (
            <p className="empty">Nenhuma notificação</p>
          )}

          {Object.keys(groupedNotifications).map((id) => (
            <div key={id} className="notif-group">
              <h5>Grupo: {id}</h5>
              {groupedNotifications[id].map((msg, index) => (
                <div key={index} className="notif-item">
                  <strong>{msg.nome}</strong>
                  <p>Quantidade Atual: {msg.quantidadeAtual}</p>
                  <p>Quantidade Mínima: {msg.quantidadeMinima}</p>
                  <p>Timestamp: {new Date(msg.timestamp).toLocaleString("pt-BR")}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
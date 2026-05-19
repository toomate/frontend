import React, { useState } from "react";
import { useNotifications } from "../../utils/useNotification.js";
import "./NotificationBell.css";

export default function NotificationBell() {
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);

  const processNotifications = (rawData) => {
    try {
      const groupedMessages = rawData.reduce((acc, message) => {
        const { id, timestamp, body } = message;

        if (!id || !body) {
          console.warn("Notification missing required fields:", message);
          return acc;
        }

        // Determine group based on the first character of the ID
        const groupKey = id[0].toLowerCase();
        let groupName = "Outros";

        if (groupKey === "e") {
          groupName = "Estoque";
        } else if (groupKey === "v") {
          groupName = "Vencimento";
        } else if (groupKey === "b") {
          groupName = "Boleto";
        }

        if (!acc[groupName]) {
          acc[groupName] = [];
        }

        acc[groupName].push({ timestamp, ...body });
        return acc;
      }, {});

      return groupedMessages;
    } catch (error) {
      console.error("Failed to process notifications:", error);
      return {};
    }
  };

  const groupedNotifications = processNotifications(notifications);

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

          {Object.keys(groupedNotifications).map((groupName) => (
            <div key={groupName} className="notif-group">
              <h5>{groupName}</h5>
              {groupedNotifications[groupName].map((msg, index) => (
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
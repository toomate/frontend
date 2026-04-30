import React, { useState } from "react";
import { useNotifications } from "../../../utils/useNotification.js";
import "./NotificationBell.css";

export default function NotificationBell() {
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);

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

          {notifications.length === 0 && (
            <p className="empty">Nenhuma notificação</p>
          )}

          {notifications.map((n, i) => (
            <div key={i} className="notif-item">
              <strong>{n.title}</strong>
              <p>{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

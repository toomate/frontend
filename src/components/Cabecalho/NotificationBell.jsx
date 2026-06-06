import React, { useState } from "react";
import { useNotifications } from "../../utils/useNotification.js";
import sseManager from "../../utils/sseManager";
import NotificationsList, {
  getNotificationKey,
} from "../NotificationsList/NotificationsList";
import "../NotificationsList/NotificationsList.css";
import "./NotificationBell.css";

export default function NotificationBell() {
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);
  const [removendoIds, setRemovendoIds] = useState({});

  const notificationList = notifications
    .filter((message) => message?.id)
    .slice(0, 20);

  const handleRemoverNotificacao = async (message, index) => {
    const itemKey = getNotificationKey(message, index);

    try {
      setRemovendoIds((prev) => ({ ...prev, [itemKey]: true }));
      const removed = await sseManager.deleteNotification(message);
      if (!removed) return;
    } catch (error) {
      console.error("Erro ao remover notificacao:", error);
      alert("Nao foi possivel remover a notificacao agora.");
    } finally {
      setRemovendoIds((prev) => {
        const next = { ...prev };
        delete next[itemKey];
        return next;
      });
    }
  };

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
          <h4 className="notif-lista-titulo">Listagem de Notificações</h4>
          <NotificationsList
            notifications={notificationList}
            onRemove={handleRemoverNotificacao}
            removendoIds={removendoIds}
            containerClass="notifications-list-container notif-lista-container"
            emptyMessage="Nenhuma notificação armazenada."
          />
        </div>
      )}
    </div>
  );
}
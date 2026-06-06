import React from "react";
import "./NotificationsList.css";

function formatNotificationText(message) {
  if (!message?.body || typeof message.body !== "object") {
    return "Notificação recebida";
  }

  const {
    nome,
    quantidadeAtual,
    quantidadeMinima,
    dataValidade,
    dataVencimento,
    mensagem,
  } = message.body;

  if (typeof mensagem === "string" && mensagem.trim()) {
    return mensagem;
  }

  const parts = [];

  if (nome) parts.push(nome);
  if (quantidadeAtual !== undefined && quantidadeMinima !== undefined) {
    parts.push(`Qtd atual: ${quantidadeAtual} | Qtd minima: ${quantidadeMinima}`);
  }
  if (dataValidade) {
    parts.push(`Validade: ${new Date(dataValidade).toLocaleDateString("pt-BR")}`);
  }
  if (dataVencimento) {
    parts.push(`Vencimento: ${new Date(dataVencimento).toLocaleDateString("pt-BR")}`);
  }

  return parts.length > 0 ? parts.join(" - ") : "Notificação recebida";
}

export function getNotificationKey(message, index) {
  return `${message?.id || "sem-id"}-${message?.body?.insumoId ?? message?.body?.idInsumo ?? "sem-insumo"}-${index}`;
}

export function canRemoveNotification(message) {
  const idInsumo =
    message?.body?.insumoId ??
    message?.body?.idInsumo ??
    message?.body?.fkInsumo ??
    message?.body?.insumo?.idInsumo ??
    message?.body?.insumo?.id ??
    String(message?.id ?? "").match(/\d+/)?.[0];
  return idInsumo !== undefined && idInsumo !== null && String(idInsumo).trim() !== "";
}

export default function NotificationsList({
  notifications = [],
  onRemove,
  removendoIds = {},
  emptyMessage = "Nenhuma notificação armazenada.",
  maxItems = 20,
  containerClass = "notifications-list-container",
}) {
  const notificationList = notifications
    .filter((message) => message?.id)
    .slice(0, maxItems);

  return (
    <div className={containerClass}>
      {notificationList.length === 0 ? (
        <p className="notifications-empty">{emptyMessage}</p>
      ) : (
        <ul className="notifications-list" aria-label="Listagem de notificações armazenadas">
          {notificationList.map((message, index) => (
            <li className="notifications-item" key={getNotificationKey(message, index)}>
              <button
                type="button"
                className="notifications-remove-btn"
                aria-label="Remover notificação"
                title={
                  !canRemoveNotification(message)
                    ? "Notificação sem id removível"
                    : removendoIds[getNotificationKey(message, index)]
                      ? "Removendo notificação"
                      : "Remover notificação"
                }
                onClick={() => onRemove && onRemove(message, index)}
                disabled={
                  !canRemoveNotification(message) ||
                  Boolean(removendoIds[getNotificationKey(message, index)])
                }
              >
                <span aria-hidden="true">🗑</span>
              </button>
              <p className="notifications-item-text">{formatNotificationText(message)}</p>
              <span className="notifications-item-date">
                {message.timestamp
                  ? new Date(message.timestamp).toLocaleString("pt-BR")
                  : "Sem data"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React from "react";
import "./NotificationsList.css";
import sseManager from "../../utils/sseManager";

function formatNotificationText(message) {
  if (!message?.body || typeof message.body !== "object") {
    return "Notificação recebida";
  }

  const body = message.body || {};
  const {
    nome,
    quantidadeAtual,
    quantidadeMinima,
    dataValidade,
    dataVencimento,
    mensagem,
  } = body;

  // Mensagem textual direta tem prioridade
  if (typeof mensagem === "string" && mensagem.trim()) {
    return mensagem;
  }

  const parts = [];

  // Estoque
  if (nome) parts.push(nome);
  if (quantidadeAtual !== undefined && quantidadeMinima !== undefined) {
    parts.push(`Qtd atual: ${quantidadeAtual} | Qtd minima: ${quantidadeMinima}`);
  }

  // Validade (body.insumo + vencimento)
  if (body.insumo) {
    parts.push(`Insumo: ${body.insumo}`);
    if (body.vencimento) {
      parts.push(`Vencimento: ${new Date(body.vencimento).toLocaleDateString("pt-BR")}`);
    }
  }

  // Boleto (descricao, valor, vencimento)
  if (body.descricao) {
    parts.push(body.descricao);
    if (body.valor !== undefined) parts.push(`Valor: R$ ${Number(body.valor).toFixed(2)}`);
    if (body.vencimento) parts.push(`Venc.: ${new Date(body.vencimento).toLocaleDateString("pt-BR")}`);
  }

  // Datas genéricas
  if (dataValidade) {
    parts.push(`Validade: ${new Date(dataValidade).toLocaleDateString("pt-BR")}`);
  }
  if (dataVencimento) {
    parts.push(`Vencimento: ${new Date(dataVencimento).toLocaleDateString("pt-BR")}`);
  }

  return parts.length > 0 ? parts.join(" - ") : "Notificação recebida";
}

export function getNotificationKey(message, index) {
  return `${message?.id || "sem-id"}-${index}`;
}

export function canRemoveNotification(message) {
  const idInsumo =
    message?.body?.insumoId ??
    message?.body?.idInsumo ??
    message?.body?.fkInsumo ??
    message?.body?.insumo?.idInsumo ??
    message?.body?.insumo?.id ??
    String(message?.id ?? "");
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
            <li
              className={`notifications-item ${message.read ? "read" : "unread"}`}
              key={getNotificationKey(message, index)}
              onClick={() => sseManager.markAsRead(message)}
            >
              <div>
                {message.title && (
                  <span className="notifications-item-title">• Notificação de {message.title} </span>
                )}
                <p className="notifications-item-text">{formatNotificationText(message)}</p>
                <span className="notifications-item-date">
                  {message.timestamp
                    ? new Date(message.timestamp).toLocaleString("pt-BR")
                    : "Sem data"}
                </span>
              </div>
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
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove && onRemove(message, index);
                }}
                disabled={
                  !canRemoveNotification(message) ||
                  Boolean(removendoIds[getNotificationKey(message, index)])
                }
              >
                <span aria-hidden="true">🗑</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import config from "../config";
const baseURL = config.VITE_SSE_URL;

const CHANNEL_NAME = "sse_channel";
const LEADER_KEY = "sse_leader";
const HEARTBEAT_KEY = "sse_heartbeat";
const NOTIFICATIONS_KEY = "sse_notifications";

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt")
  );
}

function loadStoredNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Falha ao carregar notificacoes do localStorage:", error);
    return [];
  }
}

function saveNotifications(notifications) {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.warn("Falha ao salvar notificacoes no localStorage:", error);
  }
}

function getNotificationType(notification) {
  const rawId = String(notification?.id ?? "").trim();
  const prefix = rawId[0]?.toLowerCase();

  switch (prefix) {
    case "e":
      return { key: "estoque", title: "Estoque " };
    case "b":
      return { key: "boleto", title: "Boleto " };
    case "v":
      return { key: "validade", title: "Validade " };
    default:
      return { key: "outro", title: "Notificação 🔔" };
  }
}

function getNotificationId(notification) {
  const id = String(notification?.id ?? "").trim();
  return id !== "" ? id : null;
}

function upsertNotifications(currentList, incomingList) {
  const result = [...currentList];
  let changed = false;

  for (const incoming of incomingList) {
    const incomingId = getNotificationId(incoming);
    if (!incomingId) continue;

    const existingIndex = result.findIndex(item => getNotificationId(item) === incomingId);

    if (existingIndex >= 0) {
      if (JSON.stringify(result[existingIndex]) !== JSON.stringify(incoming)) {
        result.splice(existingIndex, 1);
        result.unshift(incoming);
        changed = true;
      }
    } else {
      result.unshift(incoming);
      changed = true;
    }
  }

  return { notifications: result.slice(0, 50), changed };
}

function normalizeStoredNotifications(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }

  return upsertNotifications([], [...list].reverse()).notifications;
}

class sseManager {
  constructor() {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.eventSource = null;
    this.isLeader = false;
    this.listeners = [];

    // 👇 estado persistente de notificações
    this.notifications = normalizeStoredNotifications(loadStoredNotifications());

    this.reconnectAttempts = 0; // Track reconnection attempts
    this.maxReconnectAttempts = 5; // Limit reconnection attempts

    this.init();
  }

  init() {
    this.tryBecomeLeader();

    // Recebe mensagens de outras abas
    this.channel.onmessage = (event) => {
      this.handleIncomingData(event.data);
    };

    // Verifica líder periodicamente
    this.leaderCheckInterval = setInterval(() => {
      this.checkLeader();
    }, 3000);

    // Cleanup ao fechar aba
    window.addEventListener("beforeunload", () => {
      this.onUnload();
    });

    // Sincroniza com alterações externas no localStorage (outras abas/serviço)
    window.addEventListener("storage", (e) => {
      try {
        if (e.key === NOTIFICATIONS_KEY) {
          const stored = normalizeStoredNotifications(loadStoredNotifications());
          this.notifications = stored;
          this.notifyListeners();
        }
      } catch (err) {
        console.warn("Erro ao sincronizar notificacoes via storage event:", err);
      }
    });
  }

  // =========================
  // 🟢 LIDERANÇA
  // =========================

  tryBecomeLeader() {
    const leader = localStorage.getItem(LEADER_KEY);

    if (!leader) {
      this.becomeLeader();
    }
  }

  becomeLeader() {
    this.isLeader = true;
    localStorage.setItem(LEADER_KEY, "true");

    this.startHeartbeat();
    this.startSSE();
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      localStorage.setItem(HEARTBEAT_KEY, Date.now().toString());
    }, 2000);
  }

checkLeader() {
  const heartbeat = localStorage.getItem(HEARTBEAT_KEY);

  if (!heartbeat) {
    this.tryBecomeLeader();
    return;
  }

  const diff = Date.now() - Number(heartbeat);
  if (diff > 5000) {
    this.becomeLeader();
  }

  if (this.isLeader && !this.eventSource) {
    this.startSSE();
  }
}

  // =========================
  // 🔵 SSE
  // =========================

  startSSE() {
    if (this.eventSource) return;

    const clientId = localStorage.getItem("usuarioId");

    if (!clientId) {
      console.warn("SSE nao iniciado: usuarioId ausente.");
      setTimeout(() => this.startSSE(), 5000);
      return;
    }

    console.log("Iniciando SSE para clienteId:", clientId);
    const sseUrlWithClient = `${baseURL}conectar/${encodeURIComponent(clientId)}`;

    this.eventSource = new EventSource(sseUrlWithClient);

    this.eventSource.onopen = () => {
      console.log("SSE conectado com sucesso.");
      this.reconnectAttempts = 0; // Reset attempts on successful connection
    };

    this.eventSource.onmessage = (event) => {
      console.log("Raw SSE data received:", event.data);
      const data = event.data;

      this.channel.postMessage(data);

      this.handleIncomingData(data);
    };

    this.eventSource.onerror = () => {
      if (this.eventSource?.readyState === EventSource.CLOSED) {
        console.log("Erro SSE, reconectando...");
        this.eventSource = null;

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.startSSE(), 3000);
        } else {
          console.error("SSE reconexão falhou após várias tentativas.");
          setTimeout(() => {
              this.reconnectAttempts = 0;
              this.startSSE();
              }, 60000);
        }
        return;
      }

      console.log("SSE temporariamente indisponivel, aguardando reconexao automatica...");
    };
  }

handleIncomingData(rawData) {
  try {
    const parsed = JSON.parse(rawData);
    const incoming = Array.isArray(parsed) ? parsed : [parsed];

    const objects = incoming.map(item =>
      typeof item === "string" ? JSON.parse(item) : item
    );

    const { notifications: nextNotifications, changed } = upsertNotifications(
      this.notifications,
      objects
    );

    if (!changed) {
      return;
    }

    // Preserve `read` state for existing notifications and enrich with `type`/`title`.
    const existingReadMap = new Map(
      (this.notifications || []).map((n) => [String(n.id ?? ""), Boolean(n.read)])
    );

    this.notifications = (nextNotifications || []).map((n) => {
      const id = String(n.id ?? "");
      const typeInfo = getNotificationType(n);
      return {
        ...n,
        id,
        type: typeInfo.key,
        title: typeInfo.title,
        read: existingReadMap.has(id) ? existingReadMap.get(id) : false,
      };
    });

    saveNotifications(this.notifications);
    this.notifyListeners();
  } catch (err) {
    console.error("Erro ao processar SSE:", err);
  }
}

  subscribe(callback) {
    this.listeners.push(callback);

    callback(this.notifications);

    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb(this.notifications));
  }

async deleteNotification(notification) {
  const id = getNotificationId(notification);
  if (!id) return false;

  const token = getAuthToken();
  const response = await fetch(`${baseURL}deletar/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao remover notificacao (${response.status}).`);
  }

  const next = this.notifications.filter(item => getNotificationId(item) !== id);

  if (next.length !== this.notifications.length) {
    this.notifications = next;
    saveNotifications(this.notifications);
    this.notifyListeners();
  }

  return true;
}

  async markAsRead(notificationOrId) {
    const id =
      typeof notificationOrId === "string"
        ? notificationOrId
        : String(notificationOrId?.id ?? "");

    if (!id) return false;

    const idx = this.notifications.findIndex((n) => String(n.id) === id);
    if (idx === -1) return false;

    if (this.notifications[idx].read) return true;

    this.notifications[idx] = { ...this.notifications[idx], read: true };
    try {
      saveNotifications(this.notifications);
      this.notifyListeners();
    } catch (err) {
      console.warn("Falha ao marcar notificação como lida localmente:", err);
    }



    return true;
  }

  async markAllVisibleAsRead() {
    const idsToMark = this.notifications
      .filter((n) => n && !n.read)
      .map((n) => String(n.id ?? ""))
      .filter((id) => id !== "");

    if (idsToMark.length === 0) return true;

    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));

    try {
      saveNotifications(this.notifications);
      this.notifyListeners();
    } catch (err) {
      console.warn("Falha ao salvar notificacoes apos marcar como lidas:", err);
    }

    try {
      const token = getAuthToken();
      const base = baseURL;
      idsToMark.forEach((id) => {
        const endpoint = `${base}/ler/${encodeURIComponent(id)}`;
        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }).catch((err) => console.warn("Falha ao persistir leitura no servidor:", err));
      });
    } catch (err) {
      console.warn("Erro ao iniciar persistencia de leituras:", err);
    }

    return true;
  }


  onUnload() {
    if (this.isLeader) {
      localStorage.removeItem(LEADER_KEY);
      localStorage.removeItem(HEARTBEAT_KEY);
    }

    if (this.eventSource) {
      this.eventSource.close();
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.leaderCheckInterval) {
      clearInterval(this.leaderCheckInterval);
    }
  }
}

// Singleton
const instance = new sseManager();
export default instance;
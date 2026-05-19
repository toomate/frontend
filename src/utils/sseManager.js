const CHANNEL_NAME = "sse_channel";
const LEADER_KEY = "sse_leader";
const HEARTBEAT_KEY = "sse_heartbeat";
const SSE_URL = import.meta.env.VITE_SSE_URL;

class sseManager {
  constructor() {
    this.channel = new BroadcastChannel(SSE_URL);
    this.eventSource = null;
    this.isLeader = false;
    this.listeners = [];

    // 👇 estado persistente de notificações
    this.notifications = [];

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
  }

  // =========================
  // 🔵 SSE
  // =========================

  startSSE() {
    if (this.eventSource) return;

    const clientId = localStorage.getItem("usuarioId");

    if (!clientId) {
      console.warn("SSE nao iniciado: usuarioId ausente.");
      return;
    }

    console.log("Iniciando SSE para clienteId:", clientId);
    const sseUrlWithClient = `${SSE_URL.replace(/\/$/, "")}/${encodeURIComponent(clientId)}`;
    console.log("URL SSE:", sseUrlWithClient);

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

    this.notifications = [...objects, ...this.notifications].slice(0, 50);
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

  // =========================
  // 🔴 CLEANUP
  // =========================

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
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

    this.eventSource = new EventSource("/sse");

    this.eventSource.onmessage = (event) => {
      const data = event.data;

      // Distribui para outras abas
      this.channel.postMessage(data);

      // Processa localmente
      this.handleIncomingData(data);
    };

    this.eventSource.onerror = () => {
      console.log("Erro SSE, reconectando...");
      this.eventSource.close();
      this.eventSource = null;

      setTimeout(() => this.startSSE(), 3000);
    };
  }

  // =========================
  // 🟡 PROCESSAMENTO DE DADOS
  // =========================

  handleIncomingData(rawData) {
    try {
      const parsed = JSON.parse(rawData);

      // 👇 aqui você pode filtrar por tipo depois
      this.notifications = [parsed, ...this.notifications].slice(0, 50);

      this.notifyListeners();

    } catch (err) {
      console.error("Erro ao processar SSE:", err);
    }
  }

  // =========================
  // 🟣 SUBSCRIBE
  // =========================

  subscribe(callback) {
    this.listeners.push(callback);

    // Envia estado atual imediatamente
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
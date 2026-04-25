const CHANNEL_NAME = "sse_channel";
const LEADER_KEY = "sse_leader";
const HEARTBEAT_KEY = "sse_heartbeat";

class sseManager {
  constructor() {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.eventSource = null;
    this.isLeader = false;
    this.listeners = [];

    this.init();
  }

  init() {
    this.tryBecomeLeader();

    // Escuta mensagens vindas de outras abas
    this.channel.onmessage = (event) => {
      this.notifyListeners(event.data);
    };

    // Verifica se o líder morreu
    setInterval(() => {
      this.checkLeader();
    }, 3000);

    window.addEventListener("beforeunload", () => {
  if (this.isLeader) {
    localStorage.removeItem(LEADER_KEY);
  }
});
  }

  tryBecomeLeader() {
    let leader = localStorage.getItem(LEADER_KEY);

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
    setInterval(() => {
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

    // Se o líder não atualiza há 5s → assumir
    if (diff > 5000) {
      this.becomeLeader();
    }
  }

  startSSE() {
    if (this.eventSource) return;

    this.eventSource = new EventSource("/sse");

    this.eventSource.onmessage = (event) => {
      // envia para outras abas
      this.channel.postMessage(event.data);

      // envia para a própria aba
      this.notifyListeners(event.data);
    };

    this.eventSource.onerror = () => {
      console.log("Erro SSE, tentando reconectar...");
      this.eventSource.close();
      this.eventSource = null;

      setTimeout(() => this.startSSE(), 3000);
    };
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach((cb) => cb(data));
  }
}

// Singleton
const sseManager = new sseManager();
export default sseManager;
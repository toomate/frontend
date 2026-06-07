const config = {
  API_URL:
    window.env?.API_URL ||
    window.API_URL ||
    "http://localhost:8080",
    VITE_WAHA_API_KEY: window.env?.VITE_WAHA_API_KEY || import.meta.env.VITE_WAHA_API_KEY || "null",
    VITE_WAHA_API_URL: window.env?.VITE_WAHA_API_URL || import.meta.env.VITE_WAHA_API_URL || "http://localhost:3000",
    // Grafana fica na mesma infra, exposto na porta 3001. Por padrão usa o
    // mesmo host da aplicação (dev: localhost; prod: IP/domínio do servidor).
    // Pode ser sobrescrito por window.env.GRAFANA_URL (ex.: atrás de proxy/domínio).
    GRAFANA_URL:
      window.env?.GRAFANA_URL ||
      window.GRAFANA_URL ||
      `${window.location.protocol}//${window.location.hostname}:3001`
}

export default config
const config = {
  API_URL:
    window.env?.API_URL ||
    window.API_URL ||
    "http://localhost:8080",
    VITE_WAHA_API_KEY: window.env?.VITE_WAHA_API_KEY || import.meta.env.VITE_WAHA_API_KEY || "null",
    VITE_WAHA_API_URL: window.env?.VITE_WAHA_API_URL || import.meta.env.VITE_WAHA_API_URL || "http://localhost:3000"
}

export default config
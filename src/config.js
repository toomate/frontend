const config = {
  API_URL:
    window.env?.API_URL ||
    window.API_URL ||
    "http://localhost:8080"
}

export default config
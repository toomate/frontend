#!/bin/sh

cat <<EOF > /usr/share/nginx/html/config.js
window.env = {
  API_URL: "$API_URL",
  GRAFANA_URL: "$GRAFANA_URL",
  WAHA_URL: "$VITE_WAHA_API_URL",
  WAHA_API_KEY: "$VITE_WAHA_API_KEY",
  VITE_WAHA_API_URL: "$VITE_WAHA_API_URL",
  VITE_WAHA_API_KEY: "$VITE_WAHA_API_KEY",
  VITE_SSE_URL: "$VITE_SSE_URL"
}
EOF

exec nginx -g "daemon off;"
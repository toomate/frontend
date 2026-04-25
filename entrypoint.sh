#!/bin/sh

cat <<EOF > /usr/share/nginx/html/config.js
window.env = {
  API_URL: "$API_URL",
  VITE_WAHA_API_KEY: "${VITE_WAHA_API_KEY}",
  API_URL: "${API_URL}"
}
EOF

exec nginx -g "daemon off;"
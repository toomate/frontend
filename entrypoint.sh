#!/bin/sh

cat <<EOF > /usr/share/nginx/html/config.js
window.env = {
  API_URL: "$API_URL",
  WAHA_URL: "$WAHA_URL",
  WAHA_API_KEY: "$WAHA_API_KEY"
}
EOF

exec nginx -g "daemon off;"
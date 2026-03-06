#!/bin/sh

cat <<EOF > /usr/share/nginx/html/config.js
window.API_URL="${API_URL}";
EOF

nginx -g "daemon off;"
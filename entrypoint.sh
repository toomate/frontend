#!/bin/sh

# ---- config.js: variaveis lidas pelo browser via window.env ----
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

# ---- nginx: proxy de /sse/ -> microservico de notificacoes ----
# O browser do usuario nao alcanca o IP privado do rabbit/microservico na VPC.
# O nginx do front (que esta na VPC e tem acesso ao 8181) faz o proxy reverso,
# entao o front fala com /sse/ na mesma origem. So adiciona o bloco quando
# SSE_UPSTREAM estiver definido (em dev local nao ha nginx).
SSE_BLOCK=""
if [ -n "$SSE_UPSTREAM" ]; then
  SSE_BLOCK="
    location /sse/ {
        proxy_pass $SSE_UPSTREAM;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
"
fi

cat <<EOF > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;
$SSE_BLOCK
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

exec nginx -g "daemon off;"

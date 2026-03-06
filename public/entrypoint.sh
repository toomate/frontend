#!/bin/sh

envsubst < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.tmp
mv /usr/share/nginx/html/config.tmp /usr/share/nginx/html/config.js

nginx -g "daemon off;"
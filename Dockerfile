# Step 1: Build React
FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install

COPY . .
RUN npm run build

# Step 2: Nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY public/config.js /usr/share/nginx/html/config.js

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# Step 1: Build the React app using a Node.js base image
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the static files using a lightweight Nginx image
FROM nginx:stable-alpine
# Copy the build files from the builder stage to the Nginx web directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 5137
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

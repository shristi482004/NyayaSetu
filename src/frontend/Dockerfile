# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies with legacy peer deps support
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy application sources and build
COPY . .
RUN npm run build

# Stage 2: Serve using hardened Nginx Alpine
FROM nginx:1.27-alpine

# Configure environment substitution to substitute ONLY BACKEND_SERVICE_URL
ENV NGINX_ENVSUBST_FILTER="BACKEND_SERVICE_URL"
ENV BACKEND_SERVICE_URL="http://backend:5000"

# Copy custom Nginx reverse proxy configuration template into official templates directory
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy production build artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose default HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

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

# Copy custom Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose default HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

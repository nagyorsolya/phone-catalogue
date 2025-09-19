# Multi-stage build for React application

# Stage 1: Build the React application
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Set build-time environment variable for backend URL
ARG REACT_APP_BACKEND_URL=http://localhost:3000
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Build the application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S frontend && \
    adduser -S frontend -u 1001 -G frontend

# Create necessary directories and set permissions
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R frontend:frontend /tmp /var/cache/nginx /var/log/nginx /usr/share/nginx/html

# Switch to non-root user
USER frontend

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

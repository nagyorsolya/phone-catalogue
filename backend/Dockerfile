# Use Node.js LTS version as base image
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source files
COPY . .

# Install TypeScript globally for compilation
RUN npm install -g typescript

# Build the application (compile TypeScript)
RUN npx tsc

# Copy static files to dist directory
RUN cp -r static dist/

# Remove dev dependencies after build to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Expose the port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Change ownership of the app directory
RUN chown -R backend:nodejs /app
USER backend

# Start the application
CMD ["npm", "start"]

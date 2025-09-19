# Docker Setup for Phone Catalogue

This guide explains how to run the Phone Catalogue application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

To run the complete application (frontend + backend):

```bash
docker-compose up
```

This will start:

- **Backend API** at `http://localhost:3000`
- **Frontend React App** at `http://localhost` (port 80)

### Running the Complete Stack

```bash
# Start all services
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Services

#### Backend Service

- **Port**: 3000
- **Health Check**: `http://localhost:3000/phones`
- **API Endpoints**:
  - `http://localhost:3000/phones` - Get all phones (supports `?search=` query parameter)
  - `http://localhost:3000/phones/:id` - Get phone by ID
  - `http://localhost:3000/static/images/` - Static images

#### Frontend Service

- **Port**: 80 (accessible at `http://localhost`)
- **Technology**: React + Nginx
- **API Proxy**: Frontend proxies API calls to `/api/*` → `backend:3000/*`
- **Health Check**: `http://localhost/health`

### Application URLs

Once running, access the application at:

- **Web Application**: `http://localhost` - Complete React frontend
- **API Direct**: `http://localhost:3000` - Direct backend access
- **API via Proxy**: `http://localhost/api` - Backend API through frontend proxy

## Individual Services

### Running Backend Only

```bash
docker-compose up backend
```

### Running with Docker Directly

**Backend**:

```bash
cd backend
docker build -t phone-catalogue-backend .
docker run -p 3000:3000 phone-catalogue-backend
```

**Frontend**:

```bash
cd frontend
docker build -t phone-catalogue-frontend .
docker run -p 80:80 phone-catalogue-frontend
```

## Troubleshooting

- **Port conflicts**: If ports 80 or 3000 are already in use, modify the docker-compose.yml file to use different ports
- **Build issues**: Ensure you're running commands from the project root directory
- **Data loading errors**: Verify that the `backend/static` directory contains the required files
- **Frontend not loading**: Check that both services are healthy with `docker-compose ps`

## Development

For development purposes, you can mount the source code as volumes to enable hot reloading:

```yaml
# Add to docker-compose.yml services
backend:
  volumes:
    - ./backend:/app
    - /app/node_modules

frontend:
  volumes:
    - ./frontend/src:/app/src
```

## Network Configuration

The services communicate within Docker using:

- Backend accessible as `backend:3000` within the network
- Frontend proxies API calls from `/api/*` to `backend:3000/*`
- External access via `localhost:80` (frontend) and `localhost:3000` (backend)

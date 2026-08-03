# CoerVora AI — Deployment Guide

## Docker Compose (Recommended)

### Production Deployment

```bash
# 1. Clone repository on your server
git clone https://github.com/your-org/coervora-ai.git
cd coervora-ai

# 2. Configure environment
cp .env.example .env
# Edit .env with production values:
# - Strong SECRET_KEY
# - Secure POSTGRES_PASSWORD
# - Proper CORS_ORIGINS
# - Production API URLs

# 3. Build and start all services
docker compose up -d --build

# 4. Verify all services are running
docker compose ps
```

### Service Ports

| Service | Internal Port | External Port | URL |
|---------|--------------|---------------|-----|
| Frontend | 3000 | 3000 | http://localhost:3000 |
| Backend | 8000 | 8000 | http://localhost:8000 |
| AI Engine | 8001 | 8001 | http://localhost:8001 |
| PostgreSQL | 5432 | 5432 | — |
| ChromaDB | 8000 | 8200 | http://localhost:8200 |

### Useful Commands

```bash
# View logs
docker compose logs -f backend
docker compose logs -f ai-engine

# Restart a service
docker compose restart backend

# Rebuild after code changes
docker compose up -d --build backend

# Stop all services
docker compose down

# Stop and remove all data
docker compose down -v
```

## Production Checklist

- [ ] Generate strong `SECRET_KEY` (use `openssl rand -hex 32`)
- [ ] Set secure `POSTGRES_PASSWORD`
- [ ] Configure `CORS_ORIGINS` for your domain only
- [ ] Set `DEBUG=false`
- [ ] Configure SSL/TLS (via reverse proxy)
- [ ] Set up database backups
- [ ] Configure monitoring/logging
- [ ] Set rate limiting on API endpoints
- [ ] Review firewall rules (only expose ports 80/443)

## Reverse Proxy (Nginx)

For production, place Nginx in front of all services:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Scaling Considerations

### Horizontal Scaling
- Frontend and Backend are stateless → scale horizontally behind a load balancer
- Use Redis for session/cache sharing across instances
- ChromaDB can be replaced with Qdrant for distributed vector search

### Database Scaling
- Enable PostgreSQL connection pooling (PgBouncer)
- Set up read replicas for analytics queries
- Partition large tables by date (messages, analytics_events)

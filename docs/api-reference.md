# CoerVora AI — API Reference

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Auth Endpoints

### POST `/auth/register`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "member"
  }
}
```

### POST `/auth/login`
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer"
}
```

### GET `/auth/me`
Get the current authenticated user. **Requires auth.**

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "member",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

## Chatbot Endpoints

### GET `/chatbots`
List all chatbots for the current user. **Requires auth.**

**Response:** `200 OK`
```json
{
  "chatbots": [
    {
      "id": "uuid",
      "name": "My Website Bot",
      "website_url": "https://example.com",
      "status": "active",
      "total_conversations": 42,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

### POST `/chatbots`
Create a new chatbot. **Requires auth.**

**Request Body:**
```json
{
  "name": "My Website Bot",
  "website_url": "https://example.com",
  "description": "Customer support chatbot"
}
```

### POST `/chatbots/{id}/train`
Trigger chatbot training (crawl website + create embeddings). **Requires auth.**

**Response:** `202 Accepted`
```json
{
  "message": "Training started",
  "status": "training"
}
```

---

## Widget Endpoints (Public)

These endpoints are used by the embeddable widget. No authentication required — uses embed tokens.

### GET `/widget/{embed_token}/config`
Get widget configuration and chatbot info.

**Response:** `200 OK`
```json
{
  "chatbot_name": "My Website Bot",
  "widget_config": {
    "theme": "dark",
    "position": "bottom-right",
    "primary_color": "#6366f1",
    "avatar_url": null
  },
  "greeting": "Hi! How can I help you today?"
}
```

### POST `/widget/{embed_token}/chat`
Send a message to the chatbot.

**Request Body:**
```json
{
  "message": "What products do you offer?",
  "session_id": "visitor-session-id",
  "visitor_name": "Jane",
  "visitor_email": "jane@example.com"
}
```

**Response:** `200 OK`
```json
{
  "response": "We offer a wide range of...",
  "conversation_id": "uuid",
  "confidence": 0.92
}
```

---

## Lead Endpoints

### GET `/chatbots/{id}/leads`
Get leads captured by a chatbot. **Requires auth.**

### POST `/leads`
Manually create a lead. **Requires auth.**

### GET `/leads/export`
Export leads as CSV. **Requires auth.**

---

## Analytics Endpoints

### GET `/chatbots/{id}/analytics`
Get analytics summary for a chatbot. **Requires auth.**

**Response:** `200 OK`
```json
{
  "total_conversations": 150,
  "total_messages": 1200,
  "total_leads": 45,
  "avg_messages_per_conversation": 8,
  "period": "30d"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error description"
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request — invalid input |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient permissions |
| 404 | Not Found — resource doesn't exist |
| 422 | Validation Error — invalid request body |
| 500 | Internal Server Error |

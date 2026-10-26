# StudyForge

An AI-style study assistant. Sign up, save your notes, and turn each note into a summary,
flashcards and a short quiz.

**Stack:** Java 17 + Spring Boot 3 (REST, Spring Security + JWT) / MongoDB / Redis / Next.js 14 / Docker Compose

> **About the "AI":** No AI API is connected yet. The backend uses `MockStudyAiService`, which
> returns canned responses from `backend/src/main/resources/mock-ai-responses.json`. The service
> sits behind the `StudyAiService` interface, so a real model can be plugged in later by adding a
> new implementation and removing `@Service` from the mock.

## Run with Docker

```bash
docker compose up --build
```

- App: http://localhost:3000
- API: http://localhost:8080

## Run locally (no Docker)

1. Start MongoDB (port 27017) and Redis (port 6379).
2. Backend: `cd backend && mvn spring-boot:run`
3. Frontend: `cd frontend && npm install && npm run dev` (http://localhost:3000, proxies `/api` to port 8080)

Config lives in `backend/src/main/resources/application.yml` and can be overridden with
environment variables (`MONGO_URI`, `REDIS_HOST`, `REDIS_PORT`, `JWT_SECRET`).

## How it works

- **JWT auth:** `POST /api/auth/register` and `/api/auth/login` return a token. Send it as
  `Authorization: Bearer <token>`. Every other endpoint requires it.
- **MongoDB:** stores users, notes, and the generated study set on each note.
- **Redis:**
  - Caches generated study sets (key = hash of the note title and content, 1 hour), so
    generating the same note again is instant and skips the AI step.
  - Rate-limits generation to 5 requests per user per minute (cache hits are not counted).

## API

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | `{ email, password, displayName }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET | `/api/notes` | List your notes |
| POST | `/api/notes` | Create a note `{ title, content }` |
| GET | `/api/notes/{id}` | Get one note, with its study set if generated |
| DELETE | `/api/notes/{id}` | Delete a note |
| POST | `/api/notes/{id}/generate` | Generate summary, flashcards and quiz |

# Developer Portfolio

A modern full-stack portfolio with a React 19 frontend and a Spring Boot 3 API. Portfolio content is stored in a versioned JSON document, so PostgreSQL is not required. The admin dashboard uses JWT authentication and keeps its existing CRUD API contract.

## Features

- Responsive portfolio for profile, skills, projects, experience, and education
- JWT-protected admin editors
- Thread-safe JSON persistence with stable numeric IDs
- Atomic file replacement for every edit
- Bundled seed reset from `src/main/resources/resume.json`
- OpenAPI documentation and request validation
- Docker and Render deployment support

## Architecture

```text
React frontend  →  Spring Boot REST API  →  writable portfolio.json
                              │
                              └──────────── JWT + environment admin
```

The committed `resume.json` file is the canonical seed. On first startup, the backend copies it to `PORTFOLIO_DATA_PATH`. Admin edits change only that runtime file. `POST /api/admin/reload-resume` replaces the runtime file with the bundled seed.

## Requirements

- Java 17+
- Node.js 18+ (20+ recommended)
- npm

No database server is needed.

## Local setup

Set environment variables (or use your IDE's environment configuration):

```bash
export PORTFOLIO_DATA_PATH=./data/portfolio.json
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD='choose-a-strong-password'
export JWT_SECRET="$(openssl rand -base64 48)"
export JWT_EXPIRATION=86400000
export CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Optional admin profile fields are `ADMIN_EMAIL` and `ADMIN_PHONE`. See `.env.example` for the full list.

Run the backend:

```bash
./gradlew bootRun
```

Run the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`, the API at `http://localhost:8080`, and Swagger UI at `http://localhost:8080/swagger-ui.html`.

## JSON data model

The version 1 document contains one profile with ID `1`, plus `skills`, `projects`, `experiences`, and `education` arrays. Every array item has a stable positive numeric ID. Experiences reference projects using `projectIds`; API responses reconstruct the existing nested project objects.

New IDs are generated as `max(existing IDs) + 1`. Deleting a project also removes its ID from every experience. Unknown project associations are rejected. If an existing runtime JSON file is malformed or structurally invalid, startup fails with the path in the error instead of overwriting the file.

To make permanent content changes, edit the bundled `src/main/resources/resume.json`, commit it, and redeploy. The runtime `data/` directory is intentionally ignored by Git.

## API

Public reads:

- `GET /api/profile`
- `GET /api/skills`
- `GET /api/projects`
- `GET /api/experience`
- `GET /api/education`

Authentication:

- `POST /api/auth/login`

All portfolio `POST`, `PUT`, and `DELETE` routes require `Authorization: Bearer <token>` with the configured administrator. `POST /api/admin/reload-resume` is also ADMIN-only. Multi-user signup is not supported.

## Build and test

```bash
./gradlew clean test build
cd frontend && npm run build
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Render and Vercel setup, including the free-Render persistence limitation. See [ADMIN_SETUP.md](ADMIN_SETUP.md) for credential and token behavior.

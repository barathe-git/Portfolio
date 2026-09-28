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
- Gradle 8+
- Node.js 18+ (20+ recommended)
- npm

No database server is needed.

## Quick start

Clone the repository and enter it:

```bash
git clone git@github.com:barathe-git/Portfolio.git
cd Portfolio
git switch develop
```

If your SSH configuration uses the `personal` host alias, clone with `git@personal:barathe-git/Portfolio.git` instead.

### 1. Start the backend

Open a terminal in the repository root:

```bash
gradle bootRun
```

On macOS, if another Java version is selected, explicitly use Java 17:

```bash
JAVA_HOME=$(/usr/libexec/java_home -v 17) gradle bootRun
```

Wait for `Started PortfolioApplication`. The API is then available at:

- Portfolio API: http://localhost:8080/api/profile
- Swagger UI: http://localhost:8080/swagger-ui.html

The backend starts without PostgreSQL or any other database. On first startup it creates `./data/portfolio.json` from the committed `src/main/resources/resume.json` seed.

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in a browser. The Vite development server proxies `/api` requests to the backend on port `8080`.

### 3. Sign in to the admin dashboard

For local development, the defaults are:

```text
Username: admin
Password: admin
```

These defaults are for local use only. Set a strong password before exposing the application outside your machine.

Stop either development server with `Ctrl+C` in its terminal.

## Environment configuration

The application has local defaults, so environment variables are optional for a first run. To customize them, copy the example file:

```bash
cp .env.example .env
```

Then edit `.env`, or export the values in your shell:

```bash
export PORTFOLIO_DATA_PATH=./data/portfolio.json
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD='choose-a-strong-password'
export JWT_SECRET="$(openssl rand -base64 48)"
export JWT_EXPIRATION=86400000
export CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Optional admin profile fields are `ADMIN_EMAIL` and `ADMIN_PHONE`. See `.env.example` for the full list.

Changing `ADMIN_PASSWORD` affects new logins after restarting the backend. Existing JWTs remain valid until expiry unless `JWT_SECRET` is also changed.

For a custom frontend API URL, create `frontend/.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Build and test

Run the complete backend tests and build the Spring Boot artifact:

```bash
JAVA_HOME=$(/usr/libexec/java_home -v 17) gradle clean test build
```

On Linux or Windows, use your normal Java 17 `JAVA_HOME` configuration and run `gradle clean test build`.

Build the frontend:

```bash
cd frontend
npm install
npm run build
```

## Docker

Build and run the backend without database variables:

```bash
docker build -t portfolio-api .
docker run --rm -p 8080:8080 \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD='choose-a-strong-password' \
  -e JWT_SECRET='replace-with-a-long-random-secret' \
  portfolio-api
```

The image runs as a non-root user and writes its runtime document to `/app/data/portfolio.json`. Mount `/app/data` to retain changes when recreating a local container.

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

## Troubleshooting

- **Port 8080 is already in use:** stop the other backend process, or start this one with `PORT=8081 gradle bootRun` and update the frontend API URL.
- **Port 3000 is already in use:** run `npm run dev -- --port 3001`.
- **Gradle uses Java 11:** set `JAVA_HOME` to a Java 17 installation before running Gradle.
- **Portfolio data fails to load:** inspect the configured `PORTFOLIO_DATA_PATH`. The backend intentionally refuses to overwrite an existing malformed JSON file.
- **You want the original content back:** log in as admin and call `POST /api/admin/reload-resume`, or stop the backend and remove the local `data/portfolio.json` file so it can be seeded again.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Render and Vercel setup, including the free-Render persistence limitation. See [ADMIN_SETUP.md](ADMIN_SETUP.md) for credential and token behavior.

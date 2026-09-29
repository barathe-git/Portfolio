# Deployment Guide

The production layout is a Vercel-hosted React frontend calling a Dockerized Spring Boot service on Render. No PostgreSQL service is needed.

## Render backend

The included `render.yaml` creates one free web service. Connect the repository as a Render Blueprint, configure the required values marked `sync: false`, and optionally replace the blank admin metadata values:

| Variable | Required | Description |
|---|---:|---|
| `PORTFOLIO_DATA_PATH` | Yes | `/app/data/portfolio.json` in the supplied Blueprint |
| `ADMIN_USERNAME` | Yes | Single admin login name |
| `ADMIN_PASSWORD` | Yes | Strong plain-text secret; BCrypt-encoded only in memory |
| `ADMIN_EMAIL` | No | Admin response metadata |
| `ADMIN_PHONE` | No | Admin response metadata |
| `JWT_SECRET` | Yes | Strong JWT signing secret; Blueprint generates one |
| `JWT_EXPIRATION` | No | Token lifetime in milliseconds; default `86400000` |
| `CORS_ALLOWED_ORIGINS` | Yes | Comma-separated frontend origins |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | No | Additional patterns; defaults to `https://*.vercel.app` |

The Docker image creates `/app/data` with write access for its non-root application user. At startup, the app copies the bundled `resume.json` seed there if `portfolio.json` does not exist.

### Free Render persistence limitation

Render's free web services use an ephemeral filesystem and cannot attach a persistent disk. Admin edits therefore can disappear after a restart, replacement instance, or redeploy. A fresh instance seeds data from the committed `resume.json` again. For durable hosted editing, either commit seed changes and redeploy or move to a paid service with persistent storage.

References: [Render persistent disks](https://render.com/docs/disks) and [Render free services](https://render.com/docs/free).

## Vercel frontend

Import the repository and use:

- Root directory: `frontend`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://portfolio-8rom.onrender.com/api`

`VITE_API_BASE_URL` is injected into the frontend at build time. After adding or changing it in Vercel, redeploy the frontend; changing the value without a new deployment does not update an existing JavaScript bundle. With the value above, the browser calls Render directly, for example `https://portfolio-8rom.onrender.com/api/skills`.

The backend permits HTTPS Vercel deployment origins through `CORS_ALLOWED_ORIGIN_PATTERNS`. For a custom non-Vercel domain, add its exact origin to Render's `CORS_ALLOWED_ORIGINS`, without a trailing slash. Multiple origins are comma-separated.

## Local Docker verification

```bash
docker build -t portfolio-api .
docker run --rm -p 8080:8080 \
  -e PORTFOLIO_DATA_PATH=/app/data/portfolio.json \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD='choose-a-strong-password' \
  -e JWT_SECRET='replace-with-a-long-random-secret' \
  -e CORS_ALLOWED_ORIGINS=http://localhost:3000 \
  portfolio-api
```

For persistence across local container recreation, bind-mount a host directory to `/app/data`. This does not change the free-Render limitation.

## Operations

- Health check: `GET /api/profile`
- Reset data: authenticated `POST /api/admin/reload-resume`
- Permanent content update: edit and validate `src/main/resources/resume.json`, commit, and redeploy
- Malformed existing runtime file: inspect/fix or move that exact file; the service intentionally refuses to overwrite it

Changing `ADMIN_PASSWORD` affects new logins after restart. Tokens already issued remain valid until their expiry unless `JWT_SECRET` is also rotated.

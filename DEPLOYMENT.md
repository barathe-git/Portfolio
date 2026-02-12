# Deployment Guide

Deploy your portfolio with **Vercel** (Frontend), **Render** (Backend + PostgreSQL).

---

## Architecture

```
┌─────────────┐     HTTPS      ┌─────────────┐     Internal     ┌─────────────┐
│   Vercel    │◄──────────────►│   Render    │◄────────────────►│  Postgres   │
│  (Frontend) │                │  (Backend)  │                  │    (DB)     │
└─────────────┘                └─────────────┘                  └─────────────┘
  React App                    Spring Boot API                  Render PostgreSQL
```

---

## 1. Deploy Database & Backend on Render

### Option A: Using Blueprint (Recommended)

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Blueprint**
4. Connect your GitHub repo
5. Render will detect `render.yaml` and create:
   - PostgreSQL database (`portfolio-db`)
   - Web service (`portfolio-api`)

### Option B: Manual Setup

#### Create PostgreSQL Database

1. **Render Dashboard** → **New** → **PostgreSQL**
2. Configure:
   - **Name**: `portfolio-db`
   - **Database**: `portfolio_db`
   - **User**: `portfolio_user`
   - **Plan**: Free
3. Click **Create Database**
4. Copy the **Internal Database URL** (starts with `postgres://`)

#### Create Web Service

1. **Render Dashboard** → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `portfolio-api`
   - **Runtime**: Docker
   - **Plan**: Free
   - **Health Check Path**: `/api/profile`

4. Add **Environment Variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgres://...` (Internal URL from database) |
| `JWT_SECRET` | Generate a secure random string (64+ chars) |
| `JWT_EXPIRATION` | `86400000` (24 hours in milliseconds) |
| `CORS_ALLOWED_ORIGINS` | Your Vercel URL (set after frontend deployment) |
| `DDL_AUTO` | `update` |
| `SHOW_SQL` | `false` |
| `LOG_LEVEL_ROOT` | `WARN` |
| `LOG_LEVEL_APP` | `INFO` |

5. Click **Create Web Service**

### Wait for Deployment

The first deployment takes 5-10 minutes. Check logs for:
```
Started PortfolioApplication in X seconds
```

Your API will be at: `https://portfolio-api-xxxx.onrender.com`

---

## 2. Deploy Frontend on Vercel

### Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add **Environment Variable**:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://portfolio-api-xxxx.onrender.com/api` |

6. Click **Deploy**

Your frontend will be at: `https://your-project.vercel.app`

---

## 3. Configure CORS on Render

After getting your Vercel URL, update Render:

1. Go to your **portfolio-api** service on Render
2. Click **Environment**
3. Set `CORS_ALLOWED_ORIGINS`:
   ```
   https://your-project.vercel.app
   ```
   For multiple origins, use comma-separated:
   ```
   https://your-project.vercel.app,https://yourdomain.com
   ```
4. Click **Save Changes** (triggers redeploy)

---

## 4. Initialize Database

The schema will be created automatically via `spring.jpa.hibernate.ddl-auto=update`.

To add the initial admin user, connect to your Render PostgreSQL:

```bash
# Using psql (get connection string from Render dashboard)
psql "postgres://user:password@host:5432/portfolio_db"

# Insert admin user (password: Test@123)
INSERT INTO admin_user (username, password, email, phone_number, role)
VALUES (
  'barath',
  '$2a$10$2ZAacuKfBZCZjGdeFBqU7OXuMx/Mgz3Hqdx14s0M0aPZrCBBAyYZ2',
  'barath.contact@gmail.com',
  '+919791165728',
  'ADMIN'
);
```

Or use the Render Shell:
1. Go to your **portfolio-db** database
2. Click **Shell** tab
3. Run the SQL command above

---

## Environment Variables Reference

### Backend (Render)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | localhost | PostgreSQL connection string |
| `DB_USERNAME` | No | barath | Database username |
| `DB_PASSWORD` | No | - | Database password |
| `JWT_SECRET` | Yes | dev-key | Secret key for JWT signing (64+ chars) |
| `JWT_EXPIRATION` | No | 86400000 | Token expiry in ms (24 hours) |
| `CORS_ALLOWED_ORIGINS` | No | localhost:3000,5173 | Comma-separated allowed origins |
| `DDL_AUTO` | No | update | Hibernate DDL mode |
| `SHOW_SQL` | No | true | Log SQL queries |
| `LOG_LEVEL_ROOT` | No | INFO | Root logging level |
| `LOG_LEVEL_APP` | No | DEBUG | App logging level |
| `LOG_LEVEL_SECURITY` | No | DEBUG | Security logging level |
| `LOG_LEVEL_HIBERNATE` | No | DEBUG | Hibernate logging level |
| `PORT` | No | 8080 | Server port (Render sets this) |

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Full backend API URL with `/api` |

---

## Custom Domain Setup

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render (Backend)
1. Go to Service Settings → Custom Domains
2. Add your API subdomain (e.g., `api.yourdomain.com`)
3. Update DNS records

Don't forget to update `CORS_ALLOWED_ORIGINS` with your custom domain!

---

## Troubleshooting

### Backend not starting
- Check Render logs for errors
- Verify DATABASE_URL format (should start with `postgres://` or `postgresql://`)
- Ensure JWT_SECRET is set

### CORS errors
- Verify CORS_ALLOWED_ORIGINS includes your frontend URL (exact match, no trailing slash)
- Check browser console for the blocked origin
- Redeploy backend after changing CORS settings

### Database connection failed
- Use Internal Database URL (not External)
- Check if database is running in Render dashboard

### Frontend API calls failing
- Verify VITE_API_BASE_URL ends with `/api`
- Check network tab for actual request URL
- Ensure backend is healthy (visit health check endpoint)

### Cold starts (Free tier)
Render free tier spins down after 15 minutes of inactivity. First request may take 30-60 seconds. Consider upgrading for always-on service.

---

## Local Development After Deployment

### Backend

Copy the `.env.example` to `.env` and configure:
```bash
cp .env.example .env
# Edit .env with your local database credentials
```

Example `.env` for local development:
```properties
DATABASE_URL=jdbc:postgresql://localhost:5432/portfolio_db
DB_USERNAME=barath
DB_PASSWORD=Test@123
JWT_SECRET=local-dev-secret-key-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL_APP=DEBUG
SHOW_SQL=true
```

### Frontend

Create `frontend/.env.local`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

The vite dev server proxy still works for local development.

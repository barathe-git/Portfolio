# Administrator Setup

The application supports one administrator configured entirely through environment variables. Credentials are never stored in the portfolio JSON file or logged.

## Required values

```bash
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD='choose-a-strong-password'
export JWT_SECRET="$(openssl rand -base64 48)"
```

Optional values:

```bash
export ADMIN_EMAIL=admin@example.com
export ADMIN_PHONE=+10000000000
export JWT_EXPIRATION=86400000
```

The password is BCrypt-encoded in memory during application startup. Production deployments should always override the local development defaults.

## Login

Use the configured username and password in the existing admin login screen or call:

```http
POST /api/auth/login
Content-Type: application/json

{"username":"admin","password":"choose-a-strong-password"}
```

Send the returned token on protected requests:

```http
Authorization: Bearer <token>
```

There is no signup endpoint and no multi-user repository. Every modifying portfolio request and `POST /api/admin/reload-resume` requires the fixed `ADMIN` role.

## Credential rotation

Change `ADMIN_PASSWORD` and restart/redeploy to affect future logins. Existing JWTs remain valid until their configured expiry because they are self-contained. Rotate `JWT_SECRET` too when all existing tokens must be invalidated immediately; doing so also requires a restart/redeploy.

## Data reset

The admin dashboard reset action calls `POST /api/admin/reload-resume`. It replaces the writable runtime document with the committed `src/main/resources/resume.json` seed. On free Render, all runtime edits are temporary because the filesystem is ephemeral; commit seed changes for durable content.

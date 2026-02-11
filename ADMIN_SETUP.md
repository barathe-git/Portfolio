# Admin User Setup Guide

## Hardcoded Credentials (Current Implementation)

Admin credentials are now hardcoded directly in the application code for simplicity:

- **Username**: `admin`
- **Password**: `admin`

No database table or initialization is required.

## Credentials Location

Credentials are defined in: `src/main/java/com/bgv/portfolio/service/AdminUserService.java`

```java
private static final String ADMIN_USERNAME = "admin";
private static final String ADMIN_PASSWORD = "admin";
private static final String ADMIN_ROLE = "ADMIN";
```

## Changing Admin Password

To change the admin password:

1. Open `AdminUserService.java`
2. Update the `ADMIN_PASSWORD` constant:
   ```java
   private static final String ADMIN_PASSWORD = "your_new_password";
   ```
3. Rebuild and restart the application

## Login

Use these credentials on the login page:
- **Username**: `admin`
- **Password**: `admin`

## Note for Production

For production environments, consider:
- Using environment variables to override passwords
- Storing credentials in a secure vault (AWS Secrets Manager, HashiCorp Vault, etc.)
- Using database-based authentication with encrypted passwords


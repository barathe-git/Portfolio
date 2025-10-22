# 🌟 Developer Portfolio

A modern, full-stack portfolio application showcasing professional experience, skills, and projects. Built with industry best practices and optimized for scalability.

![Portfolio](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen)
![React](https://img.shields.io/badge/React-19.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core Features
- ✅ **Professional Portfolio Display** - Showcase skills, projects, experience, and education
- ✅ **CV Download** - Export portfolio as HTML, CSV, or JSON
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Modern UI/UX** - Smooth animations, glassmorphism effects, gradient designs
- ✅ **Admin Dashboard** - Secure content management with JWT authentication
- ✅ **Dark Mode Ready** - Beautiful dark theme support

### 🔧 Technical Features

#### Backend (Spring Boot)
- ✅ RESTful API with comprehensive endpoints
- ✅ JWT-based authentication & authorization
- ✅ PostgreSQL database with JPA/Hibernate
- ✅ Global exception handling with custom exceptions
- ✅ Request validation (Jakarta Validation)
- ✅ CORS configuration for cross-origin requests
- ✅ Swagger/OpenAPI documentation
- ✅ Structured logging (SLF4J)
- ✅ HikariCP connection pooling
- ✅ Environment-based configuration
- ✅ Audit fields for data tracking

#### Frontend (React)
- ✅ Modern React 19 with Vite
- ✅ Tailwind CSS for styling
- ✅ AOS (Animate On Scroll) library
- ✅ Lucide React icons
- ✅ Component-based architecture
- ✅ Axios for API integration
- ✅ Responsive navigation with mobile menu
- ✅ Download functionality (PDF, CSV, JSON)
- ✅ Professional resume template generation

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17+ | Programming language |
| **Spring Boot** | 3.5.6 | Application framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **Spring Data JPA** | 3.x | Data persistence |
| **PostgreSQL** | 12+ | Primary database |
| **JWT (JJWT)** | 0.12.5 | Token-based authentication |
| **Hibernate** | 6.x | ORM framework |
| **HikariCP** | Latest | Connection pooling |
| **Lombok** | Latest | Boilerplate code reduction |
| **SpringDoc OpenAPI** | 2.3.0 | API documentation |
| **Gradle** | 8.x | Build tool |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0 | UI library |
| **Vite** | 7.x | Build tool & dev server |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **Axios** | 1.7.2 | HTTP client |
| **AOS** | 3.0.0-beta.6 | Scroll animations |
| **Lucide React** | 0.408.0 | Icon library |
| **React Router** | 7.9.4 | Client-side routing |
| **jsPDF** | 2.5.1 | PDF generation |
| **html2canvas** | 1.4.1 | HTML to canvas conversion |

### DevOps & Tools
- **Git** - Version control
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│                 │         │                  │         │             │
│  React Frontend │ ──────▶ │  Spring Boot API │ ──────▶ │ PostgreSQL  │
│  (Port 3000)    │  HTTP   │  (Port 8080)     │   JPA   │  Database   │
│                 │ ◀────── │                  │ ◀────── │             │
└─────────────────┘         └──────────────────┘         └─────────────┘
                                     │
                                     │
                            ┌────────▼────────┐
                            │  JWT Security   │
                            │   Middleware    │
                            └─────────────────┘
```

### Application Layers

**Backend Architecture:**
```
Controller Layer (REST APIs)
        ↓
Service Layer (Business Logic)
        ↓
Repository Layer (Data Access)
        ↓
Database (PostgreSQL)
```

**Security Flow:**
```
Client Request → JWT Filter → Authentication → Authorization → Controller
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)** 17 or higher
- **Node.js** 18.x or higher (20.x recommended)
- **PostgreSQL** 12 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Verify Installations

```bash
# Check Java version
java -version

# Check Node.js version
node -v

# Check npm version
npm -v

# Check PostgreSQL
psql --version
```

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### 2️⃣ Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE portfolio_db;

# Create user (optional)
CREATE USER portfolio_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;

# Exit
\q
```

### 3️⃣ Environment Configuration

Create environment variables or update `src/main/resources/application.properties`:

```bash
# Database Configuration
export DB_URL=jdbc:postgresql://localhost:5432/portfolio_db
export DB_USERNAME=postgres
export DB_PASSWORD=your_password

# JWT Configuration
export JWT_SECRET=your_very_long_secret_key_here
export JWT_EXPIRATION=86400000

# Admin User (optional)
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=admin123
```

**Security Note:** For production, use strong passwords and secrets!

### 4️⃣ Install Dependencies

#### Backend Dependencies
```bash
# From project root
./gradlew clean build
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

### 5️⃣ Run the Application

#### Option A: Development Mode (Recommended for Development)

**Terminal 1 - Backend:**
```bash
# From project root
./gradlew bootRun
```
Backend will run on: http://localhost:8080

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

The frontend will proxy API requests to the backend automatically.

#### Option B: Production Mode (Integrated Deployment)

```bash
# Build frontend
cd frontend
npm run build

# This builds frontend to src/main/resources/static
# Frontend is now integrated into the backend

# Run Spring Boot
cd ..
./gradlew bootRun
```

Access the application at: **http://localhost:8080**

### 6️⃣ Initial Data Setup

The application automatically loads sample data from `src/main/resources/resume.json` on first run. You can customize this file with your information.

**Sample structure:**
```json
{
  "profile": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "title": "Your Job Title",
    "summary": "Your professional summary..."
  },
  "skills": [...],
  "projects": [...],
  "experiences": [...],
  "education": [...]
}
```

## 📚 API Documentation

### Swagger UI

Once the backend is running, access interactive API documentation:

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/api-docs

### API Endpoints

#### 🌐 Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile information |
| GET | `/api/skills` | Get all skills |
| GET | `/api/projects` | Get all projects |
| GET | `/api/experience` | Get work experience |
| GET | `/api/education` | Get education history |

#### 🔒 Admin Endpoints (JWT Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/projects` | Add new project |
| PUT | `/api/profile/{id}` | Update profile |
| DELETE | `/api/skills/{id}` | Delete skill |

### API Usage Examples

#### Get Profile
```bash
curl -X GET http://localhost:8080/api/profile
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Create Project (with JWT)
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Project Name",
    "description": "Project description",
    "techStack": "Java, Spring Boot, React",
    "githubUrl": "https://github.com/username/project"
  }'
```

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── main/
│   │   ├── java/com/bgv/portfolio/
│   │   │   ├── bootstrap/          # Data initialization
│   │   │   │   └── DataBootstrap.java
│   │   │   ├── config/             # Configuration classes
│   │   │   │   └── WebConfig.java
│   │   │   ├── controller/         # REST controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   └── PortfolioController.java
│   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   ├── ProfileDTO.java
│   │   │   │   ├── SkillDTO.java
│   │   │   │   ├── ProjectDTO.java
│   │   │   │   ├── ExperienceDTO.java
│   │   │   │   └── EducationDTO.java
│   │   │   ├── exception/          # Exception handling
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── ErrorResponse.java
│   │   │   ├── model/              # JPA entities
│   │   │   │   ├── Profile.java
│   │   │   │   ├── Skill.java
│   │   │   │   ├── Project.java
│   │   │   │   ├── Experience.java
│   │   │   │   ├── Education.java
│   │   │   │   ├── AdminUser.java
│   │   │   │   └── AuditFields.java
│   │   │   ├── repository/         # Data repositories
│   │   │   │   ├── ProfileRepository.java
│   │   │   │   ├── SkillRepository.java
│   │   │   │   ├── ProjectRepository.java
│   │   │   │   ├── ExperienceRepository.java
│   │   │   │   ├── EducationRepository.java
│   │   │   │   └── AdminUserRepository.java
│   │   │   ├── security/           # Security configuration
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JwtUtil.java
│   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   ├── service/            # Business logic
│   │   │   │   ├── PortfolioService.java
│   │   │   │   └── AdminUserService.java
│   │   │   └── PortfolioApplication.java
│   │   └── resources/
│   │       ├── application.properties    # Configuration
│   │       ├── resume.json              # Initial data
│   │       └── static/                  # Frontend build (production)
│   └── test/                            # Unit & integration tests
│
├── frontend/
│   ├── public/
│   │   ├── profile.jpg              # Profile image
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js               # Axios API client
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Hero.jsx             # Hero section
│   │   │   ├── About.jsx            # About section
│   │   │   ├── Skills.jsx           # Skills section
│   │   │   ├── Projects.jsx         # Projects showcase
│   │   │   ├── Experience.jsx       # Work experience
│   │   │   ├── Education.jsx        # Education history
│   │   │   ├── Footer.jsx           # Footer with download
│   │   │   └── DownloadModal.jsx    # CV download modal
│   │   ├── constants/
│   │   │   └── index.js             # App constants
│   │   ├── utils/
│   │   │   └── downloadCV.js        # CV generation logic
│   │   ├── App.jsx                  # Main component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind styles
│   ├── package.json
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   └── postcss.config.js
│
├── build.gradle                      # Gradle build configuration
├── settings.gradle
├── gradlew                          # Gradle wrapper (Unix)
├── gradlew.bat                      # Gradle wrapper (Windows)
└── README.md
```

## ⚙️ Configuration

### Backend Configuration

**File:** `src/main/resources/application.properties`

#### Database Configuration
```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/portfolio_db}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver
```

#### JPA/Hibernate Configuration
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
```

#### JWT Configuration
```properties
jwt.secret=${JWT_SECRET:your-secret-key}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

#### Logging Configuration
```properties
logging.level.com.bgv.portfolio=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Frontend Configuration

**File:** `frontend/vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  }
})
```

## 🎨 Customization Guide

### Update Your Portfolio Data

Edit `src/main/resources/resume.json`:

```json
{
  "profile": {
    "name": "Your Name",
    "email": "your@email.com",
    "phone": "+1234567890",
    "location": "City, Country",
    "title": "Your Professional Title",
    "summary": "Your professional summary...",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "github": "https://github.com/yourprofile"
  },
  "skills": [
    {
      "name": "Java",
      "level": "Expert",
      "category": "Languages"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "techStack": "Technologies used",
      "githubUrl": "GitHub repository URL",
      "liveDemoUrl": "Live demo URL",
      "highlight": [
        "Key achievement 1",
        "Key achievement 2"
      ]
    }
  ]
}
```

### Update Profile Image

Replace `frontend/public/profile.jpg` and `src/main/resources/static/profile.jpg` with your photo.

### Customize Theme Colors

Edit `frontend/tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom colors
        }
      }
    }
  }
}
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend JAR
cd ..
./gradlew clean build

# JAR location: build/libs/portfolio-0.0.1-SNAPSHOT.jar
```

### Run Production JAR

```bash
java -jar build/libs/portfolio-0.0.1-SNAPSHOT.jar
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY build/libs/portfolio-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Build and run:**
```bash
# Build JAR first
./gradlew clean build

# Build Docker image
docker build -t portfolio-app .

# Run container
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/portfolio_db \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your_secret \
  portfolio-app
```

### Cloud Deployment Options

- **Heroku**: Connect GitHub repo and deploy
- **AWS Elastic Beanstalk**: Upload JAR file
- **Google Cloud Platform**: Deploy to App Engine
- **Azure**: Deploy to App Service
- **DigitalOcean**: Deploy to App Platform

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** Can't connect to PostgreSQL

**Solutions:**
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start

# Verify database exists
psql -l

# Test connection
psql -U postgres -d portfolio_db
```

### Port Already in Use

**Problem:** Port 8080 or 3000 already in use

**Solutions:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Frontend Not Loading

**Solutions:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check if backend is running: `curl http://localhost:8080/api/profile`
3. Check browser console for errors
4. Verify CORS configuration in `SecurityConfig.java`

### Build Failures

**Solutions:**
```bash
# Clean Gradle build
./gradlew clean build

# Clear npm cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear Gradle cache
rm -rf ~/.gradle/caches
```

### JWT Token Issues

**Solutions:**
1. Ensure JWT secret is properly configured
2. Check token expiration time
3. Verify Authorization header format: `Bearer <token>`

## 📝 Best Practices Implemented

### Security
- ✅ JWT token-based authentication
- ✅ Password encryption with BCrypt
- ✅ CORS configuration
- ✅ Environment variable for secrets
- ✅ Input validation
- ✅ SQL injection prevention (JPA)

### Code Quality
- ✅ Clean code principles
- ✅ SOLID principles
- ✅ DRY (Don't Repeat Yourself)
- ✅ Meaningful naming conventions
- ✅ Comprehensive documentation
- ✅ Error handling

### Performance
- ✅ Database connection pooling
- ✅ Lazy loading for JPA relationships
- ✅ Optimized queries
- ✅ Frontend code splitting
- ✅ Image optimization

### Architecture
- ✅ Layered architecture (Controller-Service-Repository)
- ✅ DTO pattern
- ✅ Dependency injection
- ✅ Component-based frontend
- ✅ RESTful API design

## 🧪 Testing

```bash
# Run backend tests
./gradlew test

# Run with coverage
./gradlew test jacocoTestReport

# Frontend tests (if configured)
cd frontend
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📧 Contact

For questions or support, please contact:
- Email: your.email@example.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Spring Boot team for the amazing framework
- React team for the powerful UI library
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

**Made with ❤️ by [Your Name]**

⭐ Star this repository if you find it helpful!

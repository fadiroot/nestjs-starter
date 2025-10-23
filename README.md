# 🚀 NestJS Starter

A modern NestJS starter project for building REST APIs with user management, authentication, and internationalization. Built with NestJS, PostgreSQL, and Docker.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### 1. Setup Environment
```bash
# Copy environment file
cp env.example .env

# Edit .env and configure your variables
```

### 2. Run with Docker

#### Development Mode
```bash
# Build and start containers
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d --build

# Stop containers
docker-compose -f docker-compose.dev.yml down
```

#### Production Mode
```bash
docker-compose up --build
```

## 📚 API Documentation

Once the application is running, access Swagger documentation at:
```
http://localhost:3000/api-docs
```

## 🗄️ Database Migrations

### Generate a New Migration
```bash
# After modifying entities, generate migration
npm run migration:generate -- src/database/migrations/MigrationName
```

### Run Migrations
```bash
# Run pending migrations
npm run migration:run
```

### Revert Last Migration
```bash
npm run migration:revert
```

## 🌐 Internationalization (i18n)

The API supports multiple languages:
- **English** (en) - Default
- **French** (fr)
- **Français**
- **Arabic** (ar) - العربية

### Usage in Swagger
1. Click **Authorize** button
2. Set **language** to: `fr`, `ar`, or `en`
3. All API responses will be in the selected language

### Usage with curl/Postman
Add header or query parameter:
```bash
# Using header
curl -H "x-language: fr" http://localhost:3000/auth/login

# Using query parameter
curl http://localhost:3000/auth/login?lang=fr
```

## 🔑 Authentication

The API uses JWT authentication:
1. Register: `POST /auth/register`
2. Verify email: `GET /auth/verify-email?token=YOUR_TOKEN`
3. Login: `POST /auth/login`
4. Use the returned `accessToken` in Authorization header:
   ```
   Authorization: Bearer YOUR_ACCESS_TOKEN
   ```

## 📦 Available Scripts

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Tests
npm run test

# Linting
npm run lint
```

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Google OAuth
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## 📁 Project Structure

```
src/
├── common/          # Shared utilities, guards, decorators
├── config/          # Configuration files
├── database/        # Database config and migrations
├── i18n/            # Translation files (en, fr, ar)
└── modules/         # Feature modules
    ├── auth/        # Authentication & authorization
    ├── users/       # User management
    └── bookings/    # Appointment & booking management
```

## 🐳 Docker Services

- **api**: NestJS application (port 3000)
- **postgres**: PostgreSQL database (port 5432)
- **adminer**: Database admin UI (port 8080)

## 🔧 Troubleshooting

### Rebuild containers from scratch
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### View logs
```bash
docker-compose -f docker-compose.dev.yml logs -f api
```

### Access database directly
```bash
# Using adminer (web UI)
http://localhost:8080

# Using psql
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d app_db
```

## 📝 License

MIT


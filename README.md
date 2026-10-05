# TaskFlow

TaskFlow is a full-stack project and task management platform built with ASP.NET Core, React, TypeScript, PostgreSQL, and Docker.

It demonstrates production-style full-stack development including JWT authentication, REST APIs, Entity Framework Core, cloud PostgreSQL, responsive UI, and deployment.

## Live Demo

- Web App: https://taskflow-manny.vercel.app
- API Documentation: https://taskflow-kivc.onrender.com/swagger
- API Health: https://taskflow-kivc.onrender.com/health

# TaskFlow

A modern full-stack project and task management platform built with **ASP.NET Core 10, React, TypeScript, Entity Framework Core, and PostgreSQL**.

TaskFlow demonstrates a production-style full-stack architecture with JWT authentication, protected REST APIs, project and task management, a Kanban workflow, persistent cloud storage, Docker support, Swagger/OpenAPI documentation, and cloud deployment.

---

## Live Demo

- **Web Application:** https://taskflow-manny.vercel.app
- **API Documentation:** https://taskflow-kivc.onrender.com/swagger
- **API Health:** https://taskflow-kivc.onrender.com/health

> The hosted API may take a short time to respond after a period of inactivity depending on the hosting plan.

---

## Features

### Authentication

- User registration
- User login
- Secure password hashing
- JWT-based authentication
- Protected API endpoints
- Authenticated user-specific resources
- Persistent login token on the frontend

### Project Management

- Create projects
- View all projects owned by the authenticated user
- View individual project details
- Update projects through the REST API
- Delete projects
- Automatically delete project tasks when a project is removed
- Display project task counts

### Task Management

- Create tasks within projects
- View project tasks
- Update task information through the REST API
- Delete tasks
- Set task priorities
- Set optional due dates
- Filter tasks by project and status
- Paginated task API

### Kanban Workflow

Tasks can move through four workflow states:

```text
To Do
  ↓
In Progress
  ↓
Review
  ↓
Done
```

Task status changes are persisted through the ASP.NET Core API into PostgreSQL.

### Task Priorities

TaskFlow supports:

- Low
- Medium
- High
- Critical

### User Interface

- Responsive dark interface
- Project dashboard
- Project statistics
- Kanban task board
- Project creation modal
- Task creation modal
- Priority indicators
- Due-date display
- Authentication screens
- Mobile-responsive layouts

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| C# | Backend programming language |
| .NET 10 | Application platform |
| ASP.NET Core | REST Web API |
| Entity Framework Core | ORM and database access |
| Npgsql | PostgreSQL provider |
| PostgreSQL | Relational database |
| JWT | Authentication |
| Swagger / OpenAPI | API documentation |

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe frontend development |
| Vite | Frontend build tooling |
| React Router | Client-side routing |
| Axios | HTTP API communication |
| Lucide React | Interface icons |
| CSS | Responsive application styling |

### Infrastructure & Deployment

| Technology | Purpose |
|---|---|
| Docker | Backend containerization |
| Docker Compose | Local PostgreSQL environment |
| Neon | Cloud PostgreSQL |
| Render | ASP.NET Core API hosting |
| Vercel | React frontend hosting |
| GitHub | Source control |

---

## Architecture

```text
                     ┌─────────────────────────┐
                     │          User           │
                     └────────────┬────────────┘
                                  │
                                  │ HTTPS
                                  ▼
                     ┌─────────────────────────┐
                     │    React + TypeScript   │
                     │         Vercel          │
                     └────────────┬────────────┘
                                  │
                                  │ REST API
                                  │ JWT
                                  ▼
                     ┌─────────────────────────┐
                     │   ASP.NET Core Web API  │
                     │          Render         │
                     └────────────┬────────────┘
                                  │
                                  │ Entity Framework Core
                                  │ Npgsql
                                  ▼
                     ┌─────────────────────────┐
                     │       PostgreSQL        │
                     │          Neon           │
                     └─────────────────────────┘
```

The frontend communicates with the backend through HTTPS REST requests.

Authenticated requests include a JWT access token:

```text
Authorization: Bearer <token>
```

The ASP.NET Core API validates the token before allowing access to protected project and task endpoints.

---

## Backend Architecture

The backend is separated into multiple .NET projects:

```text
TaskFlow.Api
        │
        ▼
TaskFlow.Application
        │
        ▼
TaskFlow.Domain

TaskFlow.Api
        │
        ▼
TaskFlow.Infrastructure
        │
        ├── Entity Framework Core
        │
        └── PostgreSQL
```

### TaskFlow.Domain

Contains the core domain entities and enums:

- `User`
- `Project`
- `TaskItem`
- `TaskStatus`
- `TaskPriority`

### TaskFlow.Application

Contains application-level contracts and DTOs used by the API.

Examples:

- Authentication requests
- Authentication responses
- Project requests
- Task requests
- Task status updates

### TaskFlow.Infrastructure

Contains infrastructure concerns such as:

- `TaskFlowDbContext`
- Entity Framework Core configuration
- PostgreSQL integration
- Database migrations

### TaskFlow.Api

Contains the ASP.NET Core HTTP layer:

- Authentication controller
- Projects controller
- Tasks controller
- JWT configuration
- CORS configuration
- Swagger configuration
- Dependency injection
- API health endpoints

---

## Project Structure

```text
TaskFlow/
│
├── TaskFlow.Api/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProjectsController.cs
│   │   └── TasksController.cs
│   ├── Program.cs
│   └── appsettings.json
│
├── TaskFlow.Application/
│   └── DTOs/
│       ├── Auth/
│       ├── Projects/
│       └── Tasks/
│
├── TaskFlow.Domain/
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── Project.cs
│   │   └── TaskItem.cs
│   └── Enums/
│       ├── TaskStatus.cs
│       └── TaskPriority.cs
│
├── TaskFlow.Infrastructure/
│   └── Data/
│       ├── TaskFlowDbContext.cs
│       └── Migrations/
│
├── TaskFlow.Tests/
│
├── taskflow-client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ProjectBoard.tsx
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vercel.json
│
├── docs/
│   └── screenshots/
│       ├── dashboard.png
│       ├── kanban.png
│       └── swagger.png
│
├── Dockerfile
├── docker-compose.yml
├── TaskFlow.sln
├── .gitignore
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |

### Projects

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/projects` | Get user's projects | JWT |
| GET | `/api/projects/{id}` | Get project details | JWT |
| POST | `/api/projects` | Create project | JWT |
| PUT | `/api/projects/{id}` | Update project | JWT |
| DELETE | `/api/projects/{id}` | Delete project | JWT |

### Tasks

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/tasks` | Get/filter tasks | JWT |
| POST | `/api/tasks/{projectId}` | Create task | JWT |
| PUT | `/api/tasks/{id}` | Update task | JWT |
| PATCH | `/api/tasks/{id}/status` | Change task status | JWT |
| DELETE | `/api/tasks/{id}` | Delete task | JWT |

### System

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API information |
| GET | `/health` | API health check |
| GET | `/swagger` | Swagger documentation |

---

## Example API Workflow

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "Demo123!"
}
```

Successful authentication returns a JWT access token.

---

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "demo@example.com",
  "password": "Demo123!"
}
```

---

### Create Project

```http
POST /api/projects
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "name": "TaskFlow Platform",
  "description": "Full-stack project management application"
}
```

---

### Create Task

```http
POST /api/tasks/{projectId}
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "title": "Build authentication API",
  "description": "Implement JWT authentication",
  "priority": "High",
  "dueDate": "2026-10-20T00:00:00Z",
  "assignedUserId": null
}
```

---

### Change Task Status

```http
PATCH /api/tasks/{taskId}/status
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "status": "InProgress"
}
```

---

## Database Model

The primary relationships are:

```text
User
 │
 │ 1
 │
 └─────────────── *
                Project
                   │
                   │ 1
                   │
                   └─────────────── *
                                  Task
```

A user can own multiple projects.

A project can contain multiple tasks.

Tasks can optionally reference an assigned user.

Deleting a project cascades deletion to its associated tasks.

---

## Getting Started

### Prerequisites

Install:

- .NET 10 SDK
- Node.js
- npm
- Docker
- Git

Verify:

```bash
dotnet --version
node --version
npm --version
docker --version
```

---

## Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

---

## Local Database Setup

TaskFlow uses PostgreSQL.

The repository includes Docker Compose for running PostgreSQL locally.

Start PostgreSQL:

```bash
docker compose up -d
```

Check the container:

```bash
docker compose ps
```

To stop PostgreSQL:

```bash
docker compose stop postgres
```

To start it again:

```bash
docker compose start postgres
```

---

## Backend Configuration

For local development, configure the database connection and JWT signing key through development configuration or environment variables.

Example environment variables:

```bash
export ConnectionStrings__DefaultConnection='Host=localhost;Port=5432;Database=taskflow;Username=postgres;Password=YOUR_PASSWORD'

export Jwt__Key='YOUR_DEVELOPMENT_JWT_SECRET'
```

Never commit production credentials or JWT signing keys to source control.

---

## Database Migrations

Apply the Entity Framework Core migrations:

```bash
dotnet ef database update \
  --project TaskFlow.Infrastructure \
  --startup-project TaskFlow.Api
```

This creates the required PostgreSQL schema.

---

## Run the Backend

From the repository root:

```bash
dotnet run --project TaskFlow.Api
```

The console will display the local API URL.

Swagger is available at:

```text
/swagger
```

---

## Frontend Configuration

Move into the React project:

```bash
cd taskflow-client
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```text
.env.local
```

Add:

```env
VITE_API_URL=http://localhost:5197/api
```

Replace `YOUR_API_PORT` with the port shown when the ASP.NET Core API starts.

---

## Run the Frontend

```bash
npm run dev
```

Vite normally starts the application at:

```text
http://localhost:5173
```

---

## Production Build

### Frontend

```bash
cd taskflow-client
npm run build
```

The production files are generated in:

```text
taskflow-client/dist/
```

### Backend

```bash
dotnet publish TaskFlow.Api/TaskFlow.Api.csproj \
  -c Release \
  -o ./publish
```

---

## Docker

TaskFlow includes a Dockerfile for the ASP.NET Core API.

Build the image:

```bash
docker build -t taskflow-api .
```

The production container exposes port:

```text
8080
```

The container starts:

```text
TaskFlow.Api.dll
```

---

## Production Environment Variables

The backend requires environment variables similar to:

```text
ConnectionStrings__DefaultConnection
Jwt__Key
Jwt__Issuer
Jwt__Audience
Jwt__ExpirationMinutes
FrontendUrl
```

Example structure:

```text
ConnectionStrings__DefaultConnection = <PostgreSQL connection string>
Jwt__Key                            = <secure signing key>
Jwt__Issuer                         = TaskFlow.Api
Jwt__Audience                       = TaskFlow.Client
Jwt__ExpirationMinutes              = 60
FrontendUrl                         = https://YOUR-FRONTEND.vercel.app
```

Sensitive values must be configured through the hosting provider and must not be committed to Git.

---

## Deployment

### Frontend

The React application is deployed with **Vercel**.

Production environment:

```text
VITE_API_URL=https://YOUR-API.onrender.com/api
```

### Backend

The ASP.NET Core API is containerized with Docker and deployed with **Render**.

### Database

Production data is stored in **Neon PostgreSQL** using an SSL-enabled database connection.

---

## Security

TaskFlow implements several basic application security practices:

- Passwords are stored as hashes rather than plaintext
- JWT authentication protects project and task endpoints
- Resources are scoped to the authenticated project owner
- Database credentials are stored outside source control
- JWT signing keys are supplied through environment variables
- Production PostgreSQL connections use SSL
- CORS restricts browser access to configured frontend origins
- Unique email addresses are enforced at the database level

This project is intended as a portfolio application and should be reviewed and hardened further before being used for sensitive production workloads.

---

## Development Workflow

A typical local development environment looks like:

```text
React
http://localhost:5173
        │
        │ REST / JWT
        ▼
ASP.NET Core API
localhost
        │
        │ EF Core
        ▼
PostgreSQL
localhost:5432
Docker
```

Production uses:

```text
React
Vercel
        │
        │ HTTPS / REST / JWT
        ▼
ASP.NET Core
Render
        │
        │ EF Core / Npgsql
        ▼
PostgreSQL
Neon
```

---

## Future Improvements

Potential future enhancements include:

- Drag-and-drop Kanban tasks
- Task editing UI
- Project editing UI
- Project members
- Team collaboration
- Role-based authorization
- Admin and Manager roles
- Task assignment workflow
- Comments
- Activity history
- Notifications
- Search
- Advanced filters
- Refresh tokens
- Email verification
- Password reset
- Automated unit and integration test coverage
- CI/CD validation
- Real-time updates using SignalR

---

## What This Project Demonstrates

TaskFlow was built to demonstrate practical full-stack engineering across the complete application lifecycle:

- Designing a layered .NET solution
- Building REST APIs with ASP.NET Core
- Implementing JWT authentication
- Modeling relational data with Entity Framework Core
- Managing PostgreSQL migrations
- Building a typed React frontend
- Integrating React with protected APIs
- Implementing project and task workflows
- Containerizing a .NET application
- Managing environment-specific configuration
- Connecting to cloud PostgreSQL
- Deploying backend and frontend services
- Documenting APIs with Swagger/OpenAPI

---

## Author

**Manny Luzano**

Senior Full-Stack Developer | AI Engineer

---

## License

This project is provided as a portfolio and demonstration project.
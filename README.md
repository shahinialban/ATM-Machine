## ATM Simulator Starter

This repository contains a full-stack ATM simulation scaffold with:

- ASP.NET Core 8 Web API (`backend/ATM.Api`)
- PostgreSQL database managed through Entity Framework Core
- React front-end (`frontend/atm-client`) powered by webpack
- Docker configuration for local orchestration

### Running with Docker

```bash
docker compose up --build
```

Services:

- API: http://localhost:8080
- React client: http://localhost:3000
- Postgres: localhost:5432 (credentials in `docker-compose.yml`)

### Local development (optional)

1. Install the .NET 8 SDK, Node.js 20+, and PostgreSQL.
2. In `backend/ATM.Api`:
   ```bash
   dotnet restore
   dotnet ef database update
   dotnet run
   ```
3. In `frontend/atm-client`:
   ```bash
   npm install
   npm start
   ```

Update `appsettings.Development.json` with a valid connection string before running migrations locally.


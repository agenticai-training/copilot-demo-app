# Copilot Demo App ✅

## Project overview

This repository is a small multi-service demo showing different technology stacks and a React frontend:

- **backend-dotnet** — minimal .NET 8 Web API (binds to `http://localhost:5000` by default)
- **backend-java** — Spring Boot app (configured to use `server.port=8080`)
- **backend-python** — FastAPI app (runs on `http://localhost:8000` via Uvicorn)
- **frontend-react** — Vite + React app (dev server at `http://localhost:5173`)
- **prompts** — demo scripts and notes

The README below explains how to build, run and test each service locally.

---

## Prerequisites 🔧

Install the appropriate runtimes & tools for the services you plan to run locally:

- Node.js (v18+)
- npm (or Yarn)
- Java JDK 17+ and Maven
- .NET 8 SDK
- Python 3.10+ and pip and optionally `virtualenv`
- Optional: Docker (if you prefer containers)

---

## Directory structure 📁

- `backend-dotnet/` — .NET 8 minimal API
- `backend-java/` — Spring Boot (Maven)
- `backend-python/` — FastAPI (pyproject.toml)
- `frontend-react/` — Vite + React
- `prompts/` — demo scripts and notes

---

## Setup & quick start 💡

Clone and open the repo:

```bash
git clone <repo-url>
cd copilot-demo-app
```

Run each service in its own terminal for easier development.

### backend-dotnet

```bash
cd backend-dotnet
# restore (optional)
dotnet restore
# run the API
dotnet run
# build for production
dotnet build -c Release
```

- Default URL: `http://localhost:5000`

### backend-java

```bash
cd backend-java

# build and package
# On Mac/Linux:
./mvnw clean package
# On Windows:
mvnw.cmd clean package

# run via Maven wrapper
# On Mac/Linux:
./mvnw spring-boot:run
# On Windows:
mvnw.cmd spring-boot:run

# run via jar
java -jar target/*.jar
```

- Default URL: `http://localhost:8080`

### backend-python

```bash
cd backend-python
python -m venv .venv

# windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -U pip
# install dependencies (use your chosen tool; the repo provides pyproject.toml)
pip install fastapi uvicorn

# run dev server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# or run the module directly
python main.py
```

- Default URL: `http://localhost:8000`

### frontend-react

```bash
cd frontend-react
npm install
npm run dev
```

- Vite dev server is typically at `http://localhost:5173`
- Build for production: `npm run build`

---

## Testing 🧪

There are no test suites included by default, but these are the common commands you would run after adding tests:

- .NET: `dotnet test` (run in the test project folder)
- Java: `mvn test` (from `backend-java/`)
- Python: `pytest` (from `backend-python/`)
- Frontend (frontend-react): `npm test` (if you add test scripts)

---

## Useful commands & checks ⚡

- Check service roots with `curl` or a browser:
  - `.NET` → `curl http://localhost:5000/`
  - `Java` → `curl http://localhost:8080/`
  - `Python` → `curl http://localhost:8000/`
- If a port is in use, change it in the service config (see `Program.cs`, `application.properties`, or `uvicorn` flags).

> Tip: Use independent terminals or a process manager (or Docker Compose) to run all services concurrently during development.

---

## Troubleshooting & tips ⚠️

- Verify installed runtime versions (e.g., `dotnet --info`, `java -version`, `python --version`, `node -v`).
- If Python dependency management is required, prefer `pip` in a virtualenv or use `poetry` / `pipx`.
- If you want to containerize services, add Dockerfiles and a `docker-compose.yml` for easier orchestration.

---

## Contributing

Contributions welcome. Add tests and update this README when adding new functionality or services.

---

License: MIT (add a LICENSE file if desired)

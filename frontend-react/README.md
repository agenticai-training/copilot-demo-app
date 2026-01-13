# frontend-react ⚛️

## Overview

A small React application scaffolded with Vite. Provides a development server (`vite`) and scripts to build and preview the production bundle.

## Prerequisites 🔧

- Node.js v18+ (verify with `node -v`)
- npm (or Yarn)
- Optional: an IDE such as VS Code

## Project layout 📁

- `index.html` — app entry
- `src/` — React source files
- `package.json` — scripts & dependencies
- `vite.config.js` — Vite configuration
- `dist/` — production build output (generated)

## Setup & Quick start 💡

From the `frontend-react/` folder:

```bash
# install dependencies
npm install
# start dev server
npm run dev
```

Vite dev server typically runs at `http://localhost:5173` and prints the exact URL in the console.

## Build & Preview ⚙️

```bash
# build production assets
npm run build
# preview locally (serves the `dist` build)
npm run preview
```

## Tests 🧪

There are no tests by default. Add your test runner (e.g., Jest, Vitest) and a `test` script to `package.json` if needed.

## Docker (optional)

Example Dockerfile to build and serve the static site with a small web server:

```dockerfile
# build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# serve stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run locally:

```bash
docker build -t frontend-react .
docker run -p 8080:80 frontend-react:latest
# then open http://localhost:8080
```

## Useful commands & tips ⚡

- `npm run dev`: run the dev server with HMR
- `npm run build`: produce optimized `dist/` build
- `npm run preview`: preview the production build locally
- If the dev server port is already used, Vite will offer a different port or you can set `--port` in the `dev` script or `vite.config.js`.

## Contributing

Add components, tests, docs, or CI and update this README accordingly.

---

License: MIT

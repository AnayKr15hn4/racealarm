# GridFlag — Base44 Dev Environment

## Overview
Frontend-only Vite + React 19 + TypeScript app (motorsport race alarms). No backend, no database, no external API calls, no credentials required.

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Node 22 container, source bind-mounted at `/app`
- Vite dev server on port 3000 (HMR enabled)
- `npm install` runs on container start

## Verification
- `curl http://localhost:3000` returns the HTML shell with Vite client injected
- `curl http://localhost:3000/src/main.tsx` returns transformed source (confirms live dev server, not prebuilt)

## Notes
- `vite.config.ts` was updated: `host: true` (bind 0.0.0.0), removed `open: true` (no browser in container)
- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed via compose environment for Vite 6.1+ host allowlisting

# GridFlag (racealarm) — Base44 Dev Notes

## Stack
- Frontend-only: Vite 6 + React 19 + TypeScript
- No backend, no database, no external services/credentials

## Running
- `docker compose -f docker-compose.base44.yml up -d`
- Vite dev server on port 3000 with HMR (live reload)
- `node:22` base image, source bind-mounted at `/app`, deps installed on startup

## Notes
- `vite.config.ts` has `open: true` which logs a harmless `xdg-open ENOENT` error in the container
- No secrets required — pure client-side app

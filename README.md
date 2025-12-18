# Dockerized Next.js Frontend

This is a minimal **Next.js (App Router)** frontend that runs fully in Docker.

## Quick start

```bash
docker compose up --build
```

Then open:
- http://localhost:3000

## Dev notes

- The container mounts the project directory so edits hot-reload.
- `node_modules` is stored in a named volume to avoid host/OS mismatches.

## Useful commands

Rebuild:
```bash
docker compose up --build
```

Stop:
```bash
docker compose down
```

Clean volumes (removes container node_modules cache):
```bash
docker compose down -v
```

# AstraOS Production Cluster Mode Upgrade

This repository now includes a production-oriented infrastructure scaffold focused on:

1. **PostgreSQL as the durable initiation ledger backend** (instead of SQLite).
2. **NATS with JetStream** for event persistence and replay.
3. **OpenTelemetry + Prometheus + Grafana** for metrics, traces, and operational visibility.
4. **Auth + RBAC environment wiring** for secure service boundaries.
5. **Sovereign dashboard tab** to visualize initiation jobs and repair actions.

## What was added

- `infra/docker-compose.production.yml`
  - Adds `postgres`, `nats`, `otel-collector`, `prometheus`, and `grafana` services.
- `infra/prometheus.yml`
  - Scrape configuration for collector and service metrics.
- `infra/otel-collector.yaml`
  - OTLP receiver and Prometheus exporter pipeline.
- `.env.production.example`
  - Centralized environment contract for production cluster mode.
- `src/components/sovereign-dashboard.tsx`
  - UI dashboard over initiation ledger + repair actions with periodic refresh.

## How to run production cluster mode locally

1. Copy environment file:

   ```bash
   cp .env.production.example .env
   ```

2. Start production support stack:

   ```bash
   docker compose -f infra/docker-compose.production.yml --env-file .env up -d
   ```

3. Start app UI:

   ```bash
   npm run dev
   ```

4. Open:
   - App UI: `http://localhost:3000`
   - Prometheus: `http://localhost:9090`
   - Grafana: `http://localhost:3001`

## Service integration notes

- Configure each FastAPI service to use `DATABASE_URL` and run migrations on startup.
- Emit OTLP traces/metrics to `OTEL_EXPORTER_OTLP_ENDPOINT`.
- Publish lifecycle events through `NATS_URL` with durable JetStream subjects:
  - `initiation.job.created`
  - `initiation.job.optimized`
  - `repair.action.applied`

## Next implementation steps

1. Replace current SQLite repository adapters with PostgreSQL repositories.
2. Add migration tooling (Alembic) per service package.
3. Enforce JWT verification in FastAPI middleware.
4. Add policy-backed RBAC checks at write endpoints.
5. Add dashboard filters (region, status, date range) and pagination.

# Enterprise Management System â€” Stage 1

Multi-tenant foundation: tenant resolution (schema-per-tenant, with a
dedicated-database mode available per tenant), Auth + RBAC.

## Run it

1. docker compose up -d
2. cd backend && npm install && npm run start:dev
3. cd frontend && npm install && npm run dev

Backend on http://localhost:3000, frontend on http://localhost:5173.

## How tenancy works

Every request carries a tenant identifier (subdomain or `X-Tenant-Id` header
in dev). `TenancyMiddleware` looks up the tenant''s connection info in the
public `tenants` table, then `TenantConnectionService` hands back a
TypeORM connection scoped to that tenant''s Postgres schema (or, for
enterprise tenants, a fully separate database). Every module below the
middleware just asks for "the current tenant connection" â€” it never knows
which isolation mode it''s in.

## Next stages

Core data models -> HR -> Inventory -> Sales/CRM -> Finance -> Payroll -> Dashboard.

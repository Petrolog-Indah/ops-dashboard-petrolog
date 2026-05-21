# Implementation Plan: NestJS Historical Backend

## Overview

**Project Name:** `ops-historical-backend`  
**Purpose:** Menyimpan daily snapshots dari setiap metric untuk MoM comparison  
**Tech Stack:** NestJS + Prisma + PostgreSQL

---

## Project Structure

```
ops-historical-backend/
├── src/
│   ├── config/
│   │   ├── configuration.module.ts
│   │   └── configuration.ts          # Environment variables
│   ├── modules/
│   │   ├── metrics/
│   │   │   ├── metrics.module.ts
│   │   │   ├── metrics.controller.ts
│   │   │   ├── metrics.service.ts
│   │   │   ├── metrics.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-snapshot.dto.ts
│   │   │       └── query-snapshot.dto.ts
│   │   ├── snapshot/
│   │   │   ├── snapshot.module.ts
│   │   │   ├── snapshot.service.ts
│   │   │   ├── snapshot.cron.ts
│   │   │   └── snapshot.entity.ts
│   │   └── monthly-aggregate/
│   │       ├── monthly-aggregate.module.ts
│   │       ├── monthly-aggregate.service.ts
│   │       └── monthly-aggregate.cron.ts
│   ├── shared/
│   │   ├── constants/
│   │   │   └── metrics.constants.ts  # List of metric names
│   │   ├── interfaces/
│   │   │   └── snapshot.interface.ts
│   │   ├── services/
│   │   │   ├── http-fetch.service.ts  # Reusable HTTP fetch
│   │   │   └── logging.service.ts
│   │   └── utils/
│   │       └── date.utils.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
├── .env
├── docker-compose.yml               # Optional: PostgreSQL container
├── nest-cli.json
├── package.json
└── tsconfig.json
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model DailySnapshot {
  id          Int      @id @default(autoincrement())
  metricName  String   @map("metric_name")
  value       Decimal  @db.Decimal(10, 2)
  subLabel    String?  @map("sub_label")
  snapshotDate DateTime @map("snapshot_date") @db.Date
  createdAt   DateTime @default(now()) @map("created_at")

  @@unique([metricName, snapshotDate], name: "unique_daily_metric")
  @@index([metricName])
  @@index([snapshotDate])
  @@map("daily_snapshots")
}

model MonthlyAggregate {
  id          Int      @id @default(autoincrement())
  metricName  String   @map("metric_name")
  month       DateTime @db.Date
  avgValue    Decimal? @map("avg_value") @db.Decimal(10, 2)
  minValue    Decimal? @map("min_value") @db.Decimal(10, 2)
  maxValue    Decimal? @map("max_value") @db.Decimal(10, 2)
  dataPoints  Int      @map("data_points")
  createdAt   DateTime @default(now()) @map("created_at")

  @@unique([metricName, month], name: "unique_monthly_metric")
  @@index([metricName])
  @@index([month])
  @@map("monthly_aggregates")
}
```

---

## Tasks

- [ ] 1. Initialize NestJS Project

  **What to do**:
  - Install NestJS CLI globally: `npm i -g @nestjs/cli`
  - Create new project: `nest new ops-historical-backend`
  - Install dependencies: `npm install --save @nestjs/config @nestjs/schedule @nestjs/common @prisma/client`
  - Install dev dependencies: `npm install --save-dev prisma typescript @types/node`

- [ ] 2. Setup Prisma & Database

  **What to do**:
  - Initialize Prisma: `npx prisma init`
  - Copy schema to `prisma/schema.prisma`
  - Run migration: `npx prisma migrate dev --name init`
  - Generate client: `npx prisma generate`

- [ ] 3. Setup Configuration Module

  **What to do**:
  - Create `src/config/configuration.ts` - Load env variables
  - Create `src/config/configuration.module.ts` - Export ConfigModule
  - Setup `.env` file with:
    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/ops_historical
    API_SOURCE_URL=http://external-api-url
    CRON_SCHEDULE=0 8 * * *         # Daily 08:00
    ```

- [ ] 4. Create Shared Constants & Interfaces

  **What to do**:
  - Create `src/shared/constants/metrics.constants.ts` - List of metric names:
    ```typescript
    export const METRIC_NAMES = {
      CCTV_ONLINE: 'CCTV Online',
      BILLED_JETTY_MTD: 'Billed Jetty MTD',
      UNIT_VALID_LICENSE: 'Unit Valid Lincense',
      WITHIN_GEOFENCE: 'Within Geofence',
      COMMERCIAL_RATE: 'Commercial Rate',
      UTILISATION_RATE: 'Utilisation Rate',
    } as const;
    ```
  - Create `src/shared/interfaces/snapshot.interface.ts`
  - Create `src/shared/utils/date.utils.ts`

- [ ] 5. Create Metrics Module (API Endpoints)

  **What to do**:
  - Create `src/modules/metrics/metrics.entity.ts` - Prisma model wrapper
  - Create `src/modules/metrics/dto/create-snapshot.dto.ts`
  - Create `src/modules/metrics/dto/query-snapshot.dto.ts`
  - Create `src/modules/metrics/metrics.service.ts` - CRUD operations
  - Create `src/modules/metrics/metrics.controller.ts` - REST API:
    - `GET /metrics` - Get all snapshots (with filters)
    - `GET /metrics/:metricName` - Get specific metric
    - `GET /metrics/:metricName/history` - Get historical data
    - `GET /metrics/:metricName/month-over-month` - Compare current vs previous month

- [ ] 6. Create Snapshot Cron Job

  **What to do**:
  - Create `src/modules/snapshot/snapshot.service.ts` - Fetch & save logic
  - Create `src/modules/snapshot/snapshot.cron.ts` - @Cron decorator:
    ```typescript
    @Cron('0 8 * * *') // Daily 08:00
    async handleDailySnapshot() {
      // Fetch dari external API
      // Simpan ke database
    }
    ```
  - Enable scheduler in `main.ts`: `app.enableShutdownHooks()`

- [ ] 7. Implement HTTP Fetch Service

  **What to do**:
  - Create `src/shared/services/http-fetch.service.ts` - Reusable fetch wrapper
  - Handle:
    - Request/response logging
    - Timeout handling
    - Error retry (optional)
  - Make it injectable

- [ ] 8. Create Monthly Aggregate Cron Job (Optional)

  **What to do**:
  - Create `src/modules/monthly-aggregate/monthly-aggregate.service.ts`
  - Create `src/modules/monthly-aggregate/monthly-aggregate.cron.ts`
  - Run di awal bulan untuk compute previous month stats

- [ ] 9. Setup App Module

  **What to do**:
  - Import semua modules di `src/app.module.ts`
  - Setup PrismaModule
  - Setup ConfigurationModule
  - Setup SchedulerModule

- [ ] 10. Error Handling & Logging

  **What to do**:
  - Add exception filter
  - Add logging interceptor
  - Setup graceful shutdown

- [ ] 11. Docker Compose (Optional)

  **What to do**:
  - Create `docker-compose.yml` untuk PostgreSQL
  - Create `Dockerfile` untuk NestJS app

---

## API Endpoints

| Method | Endpoint | Description |
| ------ | ------- | ---------- |
| GET | `/metrics` | Get all snapshots with date filters |
| GET | `/metrics/:metricName` | Get specific metric latest |
| GET | `/metrics/:metricName/history?startDate=&endDate=` | Get historical data |
| GET | `/metrics/:metricName/month-over-month` | MoM comparison |
| GET | `/snapshots/trigger` | Manual trigger (for testing) |

---

## Configuration

```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT || '3000',]
  database: {
    url: process.env.DATABASE_URL,
  },
  api: {
    sourceUrl: process.env.API_SOURCE_URL,
  },
  cron: {
    schedule: process.env.CRON_SCHEDULE || '0 8 * * *',
  },
});
```

---

## Commit Strategy

- **1**: `feat: setup nestjs project structure` - package.json, tsconfig.json, nest-cli.json
- **2**: `feat: add prisma schema and migration` - prisma/schema.prisma
- **3**: `feat: add config module` - src/config/
- **4**: `feat: add shared constants and interfaces` - src/shared/
- **5**: `feat: add metrics module with CRUD` - src/modules/metrics/
- **6**: `feat: add snapshot cron job` - src/modules/snapshot/
- **7**: `feat: add http fetch service` - src/shared/services/
- **8**: `feat: add monthly aggregate cron` - src/modules/monthly-aggregate/
- **9**: `feat: wire app module` - src/app.module.ts
- **10**: `feat: add docker compose` - docker-compose.yml

---

## Notes

1. **External API Integration**: Untuk fetch data, perlu tau:
   - Endpoint untuk setiap metric
   - Auth requirements
   - Response format

2. **Cron Job di Development**: Gunakan `@Cron('* * * * *')` untuk testing (setiap menit)

3. **Error Handling**: Jika external API down, skip snapshot dan log warning

4. **Testing**: POST `/snapshots/trigger` untuk testing manual
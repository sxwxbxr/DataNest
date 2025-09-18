# DataNest
Ein persoenliches Daten Dashboard fuer Fitness Finanzen und Notizen mit Konnektoren.

## Ziel
Daten aus Quellen zusammenziehen darstellen und Insights generieren.

## Features
* Konnektoren Google Fit Apple Health Export CSV Bank CSV Notion Export
* Widgets Charts Tabellen
* Insight Regeln Anomalien Erkennen
* Export nach CSV PDF

## Tech Stack
* Next.js 14 App Router
* TypeScript
* FastAPI Python fuer ETL
* Postgres
* Prisma
* Auth mit NextAuth

## Kritische Packages
* next react zod
* recharts oder chart js
* prisma
* next auth
* fastapi pydantic
* pandas numpy
* schedule apscheduler

## Env Variablen
* DATABASE_URL
* NEXTAUTH_SECRET
* JWT_SECRET

## API Outline
* POST api ingest source
* GET api widgets
* GET api insights

## Datenmodell
* user
* source
* dataset
* widget
* insight

## Setup
* pnpm i
* pnpm prisma migrate dev
* pnpm dev
* uvicorn backend main

## Ordnerstruktur
* apps web
* apps api
* packages ui types

## Tests
* Unit fuer ETL Parser
* Playwright fuer UI

## CI
* Build Lint Test DB Migrations check

## Security
* Row Level Security
* Verschluesselung ruhender Daten auf DB Ebene

## Roadmap
* Notion Zweiwege Sync
* Regel Editor

## Lizenz
MIT

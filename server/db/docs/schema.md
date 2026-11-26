---
title: Mednova – Database Schema 
tags: [mednova, database, postgres, supabase, schema]
---

# Mednova – Database Schema (Supabase / PostgreSQL)

## 1. ERD

![alt text](MEDNOVA-ERD-1.jpg)


## 2. One-Command Setup

1. Inside `server/`, install packages: `npm install`.
2. Copy `db/.env.example` into `server/.env` and paste Supabase PostgreSQL `DATABASE_URL` (Session Pooler URI recommended for IPv4 networks).
3. Run from scratch:
   ```bash
   npm run db:setup
   ```


## 4. Migration File

| Order | File | Scope |
| :--- | :--- | :--- |
| 1 | `001_init_schema.sql` | All 21 tables (core, academic, QCM, threads, flashcards, MedSwap) + all indexes |

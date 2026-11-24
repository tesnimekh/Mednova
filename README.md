# Mednova

Collaborative study platform for medical students: courses, QCM, flashcards and discussion threads.

## Stack

- Client: React, Vite, Tailwind CSS, React Router, Zustand
- Server: Node.js, Express, MySQL

## Requirements

- Node.js 20+
- MySQL 8+ (needed from US-01)

## Quick start

```bash
git clone https://github.com/<org>/<repo>.git
cd <repo>
npm install
npm run install:all
cp server/.env.example server/.env   # Windows: Copy-Item server/.env.example server/.env
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000/api/health

The home page shows `API status: ok` when client and server are connected.

## Scripts

| Command               | What it does                                  |
| --------------------- | --------------------------------------------- |
| `npm run install:all` | Installs root, server and client dependencies |
| `npm run dev`         | Starts API and client together                |
| `npm run lint`        | Lints both apps                               |
| `npm run format`      | Formats the code with Prettier                |

# Mednova

Study platform for medical students.

- `server/`: Express API
- `client/`: React + Vite + Tailwind + React Router + Zustand

## Quick start

Requires Node.js 20+.

```bash
git clone https://github.com/tesnimekh/Mednova.git
cd Mednova
npm install
npm run install:all
cp server/.env.example server/.env   # Windows: Copy-Item server/.env.example server/.env
npm run dev
```

- Client: http://localhost:5173 (shows `API status: ok`)
- API: http://localhost:5000/api/health

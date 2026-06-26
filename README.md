# Soutrali Deals — Frontend marketplace

Application web Next.js pour la marketplace Soutrali Deals (métiers, freelance, E-marché, messagerie, commandes).

## Prérequis

- Node.js 20+
- Backend API en cours d'exécution (`soutralideals/backend` sur le port **3000**)

## Installation

```bash
npm install
cp .env.example .env.local
```

Remplir `.env.local` (minimum) :

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_SENTRY_DSN=   # optionnel en dev (actif en production)
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Dev sur **http://localhost:3001** |
| `npm run build` | Build production |
| `npm run start` | Serveur prod local sur **http://localhost:3001** |
| `npm run lint` | ESLint |

## Architecture

- **App Router** (`src/app/`) — pages et routes API BFF
- **Proxy API** — le navigateur appelle `/api/backend/*` → backend Express
- **Auth** — cookies `httpOnly`, middleware de protection des routes pro
- **Sentry** — monitoring erreurs (actif en `NODE_ENV=production`)
- **PWA** — manifest + service worker (`public/sw.js`)

## Test Sentry (local)

```bash
npm run build
npm run start
```

Ouvrir `http://localhost:3001/debug-sentry` (accessible uniquement en local).

## Déploiement (plus tard)

Variables à configurer sur la plateforme (Render, Vercel, etc.) :

- `NEXT_PUBLIC_API_URL` — URL publique de l'API
- `NEXT_PUBLIC_APP_URL` — URL publique du frontend
- `NEXT_PUBLIC_SENTRY_DSN` — DSN projet **sdeals-front**
- `SENTRY_AUTH_TOKEN` — optionnel, source maps Sentry

## Projet lié

- API : `../soutralideals/backend`
- Site vitrine : `../soutrali-deals`

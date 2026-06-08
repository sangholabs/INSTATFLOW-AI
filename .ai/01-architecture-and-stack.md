# Architecture & Tech Stack

This document outlines the architectural boundaries and tech stack of InstaFlow AI.

## 1. Core Tech Stack
- **Frontend Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS 4.x (Strict utility-first approach)
- **Icons**: Lucide React
- **Animations**: Motion (framer-motion compatible)
- **Backend Framework**: Express.js (running via `server.ts`)
- **AI SDK**: `@google/genai` (Google Gemini API)

## 2. Directory Structure & Roles
- **`/src/`**: All React frontend code. Runs on port 3000 during dev, served statically during production.
- **`/server.ts`**: The singular backend entry point. It hosts the `/api/generate` proxy endpoint to protect the `GEMINI_API_KEY`.
- **`/dist/`**: The compiled output directory. `server.cjs` and the static React assets reside here after `npm run build`.

## 3. How to Run the App
- **Development**: `npm run dev`
  - Runs BOTH the React Vite server and the Express backend simultaneously via `tsx`.
- **Production Build**: `npm run build`
  - Bundles React into `/dist/` and compiles `server.ts` into `/dist/server.cjs` via esbuild.
- **Production Start**: `npm run start`
  - Runs the compiled `dist/server.cjs` which serves the React static files and listens to the API endpoints.

## 4. Architectural Rules
- **No Direct API Calls**: The frontend MUST NEVER call the Gemini API or any sensitive external API directly. All requests must go through `/api/*` endpoints in `server.ts`.
- **Port Conflict Prevention**: Both frontend and backend share the same logic structure to prevent port 3000 conflicts. Do not spin up conflicting dev servers.

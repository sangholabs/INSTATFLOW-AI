# Data Schema & API Guidelines

The strict typing and API proxying are the backbone of InstaFlow AI's stability.

## 1. Type Strictness (`/src/types.ts`)
- The `InstagramContentPayload` is the single source of truth for the user's form state.
- **DO NOT alter the core interfaces** in `types.ts` without manually ensuring that `FormTabs.tsx`, `App.tsx`, and `server.ts` are perfectly synchronized to handle the new/modified types.
- If you add a new required field to the frontend, you MUST update the `calculateProgress` function in `FormTabs.tsx` to include it in the validation logic.

## 2. Express Backend (`/server.ts`)
- **JSON Schema Enforcement**: `server.ts` uses the `@google/genai` SDK and enforces structured JSON responses via `responseSchema` (e.g., `Type.OBJECT`).
- If you add new data requirements (like a new section for the Instagram post), you MUST update the `responseSchema` in `server.ts` so the AI returns the correct structure.

## 3. Webhook Integration (n8n)
- The app supports sending final payloads to external n8n webhooks.
- Ensure that the frontend payload structure remains clean and easily serializable, as it serves as the exact payload sent to agency workflows.
- `server.ts` acts as a proxy for these requests to avoid CORS issues.

## 4. Security
- `GEMINI_API_KEY` must NEVER be exposed to the client. Do not use `VITE_GEMINI_API_KEY` unless it's strictly a client-only fallback implementation. The primary route should always be via `/api/generate`.

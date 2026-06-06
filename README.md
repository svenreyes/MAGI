# MAGI

MAGI is a living personality graph. Users answer onboarding questions, import
context from an LLM, journal, and interact over time. From this, MAGI models
3–5 AI **personality agents** representing distinct facets of the user's
identity, and lets users selectively expose facets to different social circles.

This repo is the **iOS-first Expo (SDK 56) client**. It is fully navigable today
on local **mock data** — no backend required — so the product can be explored
before AI and persistence are wired in.

## Quick start

> Requires Node `>= 20.19.4` (Expo SDK 56). Check with `node --version`.

```bash
npm install
cp .env.example .env   # optional until you connect Supabase / the API
npx expo start         # press i for iOS simulator, or scan the QR in Expo Go
```

The app launches into the main tabs using seeded mock data. To experience the
onboarding flow, open **Profile → Re-run onboarding** (or flip
`onboardingCompleted` to `false` in `src/lib/mock-data.ts`).

## Tech stack

- **Frontend:** React Native, Expo, TypeScript, Expo Router
- **Backend (planned):** FastAPI fronting OpenAI + Honcho
- **Data:** Supabase Postgres + Auth + Storage, `pgvector` for embeddings

Styling currently uses the project's themed primitives (`ThemedText`,
`ThemedView`, theme tokens in `src/constants/theme.ts`). NativeWind can be added
later without changing the architecture.

## Project structure

```
src/
  app/                 # Expo Router routes (thin files -> screens)
    (tabs)/            # Home, Circles, Rewrite, Journal, Profile
    onboarding.tsx
    agent-generation.tsx
    agent/[id].tsx
  screens/             # Screen components
  components/          # Reusable UI (agent card, chips, toggles, ...)
  services/            # Data/AI access layer (mock today, Supabase/API later)
  hooks/               # Store-bound React hooks
  lib/                 # Supabase client, env, in-memory app store
  types/               # Domain models + Supabase Database types
  utils/               # ids, dates, colors, visibility, agent factory
  constants/           # theme, onboarding questions, agent archetypes
supabase/
  migrations/0001_init.sql   # Postgres schema (tables, RLS, pgvector)
```

## MVP features (scaffolded)

1. **Personality agent generation** — `src/services/agents.ts` +
   `src/utils/agent-factory.ts` produce 3–5 agents from onboarding answers.
2. **Memory import** — `src/services/memory.ts` builds the ChatGPT/Claude
   prompt; the onboarding flow collects the pasted response.
3. **AI visual identity** — each agent has a style, color palette, and avatar
   (`src/utils/color.ts`, placeholder avatars today).
4. **Social circles + permissions** — `src/utils/visibility.ts` and the Circles
   screen control which agents each circle can see.
5. **Agent messaging** — `src/services/interactions.ts` (placeholder replies).
6. **One story, multiple narratives** — `src/services/rewrite.ts` rewrites one
   idea per agent for Instagram / LinkedIn / X / Journal / Blog.

## Connecting the backend

Mock services are isolated in `src/services/*`. To go live:

1. Create a Supabase project, run `supabase/migrations/0001_init.sql`, and set
   `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`. The client in
   `src/lib/supabase.ts` activates automatically.
2. Stand up the FastAPI backend (OpenAI + Honcho), set
   `EXPO_PUBLIC_API_BASE_URL`, and replace the bodies of `generateAgents`,
   `rewriteStory`, and `sendMessageToAgent` with API calls. Return shapes and
   store updates stay the same.

The **Profile** screen shows live "Mock vs Connected" status for each backend.

## Honcho

Honcho runs server-side so its API key is never bundled into the Expo app.

```bash
cp .env.example .env
# Add HONCHO_API_KEY to .env, then export it in your shell.
set -a
source .env
set +a

uv sync
uv run python -m backend.honcho_smoke_test
```

The smoke test creates a session in the `MAGI` workspace, adds `user_123` with
`observe_me=True`, stores `I love hiking`, and queries the user's representation.

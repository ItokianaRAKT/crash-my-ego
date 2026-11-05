# 💥 CrashMyEgo

A **passive-aggressive code reviewer** dressed up as a clinical, monochrome
code terminal. Paste your code, hit the button, and let a cynical verdict fade
in over a blurred editor.

## ✨ Features

- ⚛️ "Laboratory monochrome" theme: pure `#0a0a0a` background, white primary
  text, muted zinc secondary text, hairline `zinc-900` borders — zero accents
- 📝 Editor as the center of attention: full-width card, line-number gutter
  synced with the textarea, live `Ln/Col` status bar, `Ctrl + Enter` submit
- ⚪ Solid white **Lancer la revue** action button (`bg-white text-black`)
- 🌫️ Core effect: the review never lands in a box — a full-container
  `backdrop-blur-md` overlay (`bg-black/60`) blurs and locks the editor while
  the punchline fades into the center in large white text
- 🔗 Minimalist **Corriger mon code** link dismisses the blur and unlocks the
  editor
- 🤖 Express backend calling **Groq** (`llama3-8b-8192`) for the roast, with a
  built-in local fallback so the app stays usable without an API key

## 🛠️ Stack

- React 18 (functional components + hooks)
- TypeScript (strict, no `any`) — separate configs for the app and the server
- Tailwind CSS (fade-in / shimmer keyframes, no custom color tokens)
- Backend: Express 5 + `groq-sdk` + `cors` + `dotenv`, run through `tsx`
- Fonts via Google Fonts CDN: **Inter** for the UI, **JetBrains Mono** for code
- Icons: hand-drawn inline SVG — no icon package to install

## 🚀 Getting started

```bash
npm install
```

Backend dependencies (already listed in `package.json`):

```bash
npm install express cors dotenv groq-sdk
npm install -D @types/express @types/cors @types/node tsx
```

Configure the environment, then start the API and the frontend in two
terminals:

```bash
cp .env.example .env   # then paste your Groq API key
npm run server         # http://localhost:3000
npm run dev            # http://localhost:5173
```

`.env` template:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

### Scripts

| Script                | Description                                        |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | Start the Vite dev server (proxies `/api` → :3000) |
| `npm run server`      | Start the Express review API on port 3000          |
| `npm run build`       | Type-check app **and** server, then build          |
| `npm run preview`     | Preview the production build                       |
| `npm run typecheck`   | Type-check the app and the server                  |

## 🧩 Components

| File                                | Responsibility                                       |
| ----------------------------------- | ---------------------------------------------------- |
| `src/App.tsx`                       | Page shell, review state machine and overlay wiring  |
| `src/types.ts`                      | Shared interfaces, card props and API state union    |
| `src/api/reviewApi.ts`              | `POST /api/review` with local fallback               |
| `src/components/EditorCard.tsx`     | Code workspace: gutter, textarea, white action button |
| `src/components/PunchlineOverlay.tsx` | Blurred overlay with the loading state and punchline |
| `src/components/icons/ModernIcons.tsx` | Hand-drawn stroke SVG icon set                    |
| `src/index.css`                     | Monochrome base, selection and scrollbars            |
| `server/server.ts`                  | Express API: CORS, validation and the Groq call      |
| `server/tsconfig.json`              | Strict Node type-check config for the server         |

## 🔌 Backend contract

```http
POST /api/review
Content-Type: application/json

{ "code": "const x = 1;" }
```

Success:

```json
{ "review": "Votre code a été refusé par comité." }
```

Failure:

```json
{ "error": "Service de mépris indisponible." }
```

The server prompts `llama3-8b-8192` with a strict system prompt (a senior,
cold, contemptuous engineer who gives one short verdict and no solution) and
answers `400` when `code` is missing, `500` with a themed message when Groq
fails.

If the endpoint is unreachable or answers an error, `reviewApi.ts` falls back
to a locally generated cynical review so the overlay still delivers the
punchline.

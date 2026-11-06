#  CrashMyEgo

A **passive-aggressive code reviewer** dressed up as a clinical, monochrome
code terminal. Paste your code, hit the button, and let a cynical verdict fade
in over a blurred editor.

##  Features

-  "Laboratory monochrome" theme: pure `#0a0a0a` background, white primary
  text, muted zinc secondary text, hairline `zinc-900` borders — zero accents
-  Editor as the center of attention: full-width card, line-number gutter
  synced with the textarea, live `Ln/Col` status bar, `Ctrl + Enter` submit
-  Solid white **Lancer la revue** action button (`bg-white text-black`)
-  Core effect: the review never lands in a box — a full-container
  `backdrop-blur-md` overlay (`bg-black/60`) blurs and locks the editor while
  the punchline fades into the center in large white text
-  Minimalist **Corriger mon code** link dismisses the blur and unlocks the
  editor
-  Express backend calling **Groq** through an ordered list of models
  (`qwen/qwen3.8-27b`, `openai/gpt-oss-20b`, `openai/gpt-oss-120b`,
  `allam-2-7b`) with automatic fallback to the next one when a model is
  unavailable, plus a built-in local fallback so the app stays usable without
  an API key

##  Stack

- React 18 (functional components + hooks)
- TypeScript (strict, no `any`) — separate configs for the app and the server
- Tailwind CSS (fade-in / shimmer keyframes, no custom color tokens)
- Backend: Express 5 + `groq-sdk` + `cors` + `dotenv`, run through `tsx`
- Fonts via Google Fonts CDN: **Inter** for the UI, **JetBrains Mono** for code
- Icons: hand-drawn inline SVG — no icon package to install

##  Getting started

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
GROQ_MODELS=qwen/qwen3.8-27b,openai/gpt-oss-20b,openai/gpt-oss-120b,allam-2-7b
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

##  Components

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

##  Backend contract

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

The server walks the comma-separated `GROQ_MODELS` list (default
`qwen/qwen3.8-27b`, `openai/gpt-oss-20b`, `openai/gpt-oss-120b`,
`allam-2-7b` — all free and available on the key) with a strict system prompt
(a senior, cold, contemptuous engineer who gives one short verdict and no
solution). When a model is decommissioned, rate-limited or answers empty, the
next one in the list is tried automatically; the last working model becomes
the preferred one for the following requests. Only an auth failure (`401`/
`403`) stops the chain. If every model fails, the server answers `500` with a
themed message (`400` when `code` is missing).

If the endpoint is unreachable or answers an error, `reviewApi.ts` falls back
to a locally generated cynical review so the overlay still delivers the
punchline.

##  Security

Hardening based on the [OWASP Top 10](https://owasp.org/Top10/):

- **A01 — Broken access control**: CORS restricted to `http://localhost:5173`,
  `X-Frame-Options: DENY` and a `Cross-Origin-Resource-Policy` header block
  framing and cross-origin embedding.
- **A02 — Cryptographic failures**: no secrets in the client bundle; the Groq
  key stays server-side in `.env` (gitignored) and is never echoed in responses
  or logs.
- **A03 — Injection**: user code is wrapped in `<code_to_review>` delimiters
  with an explicit system-prompt rule to treat it as text to comment, never as
  instructions (prompt injection); input is validated (`code` must be a
  non-empty string under 20 000 characters) and JSON bodies are capped at
  100 kb.
- **A04 — Insecure design**: in-memory rate limiting (20 requests per minute
  per IP, `429` with `Retry-After`), a 30 s timeout on every Groq call, and
  generic error messages that never leak stack traces.
- **A05 — Security misconfiguration**: `X-Powered-By` disabled, security
  headers (`nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy`,
  `Cross-Origin-Opener-Policy`) set on every response, JSON-only `404`/`500`
  handlers, and a Content Security Policy in `index.html`
  (`default-src 'self'`, no `object-src`, no inline scripts).
- **A06 — Vulnerable components**: `npm audit` runs clean (the advisory on
  `esbuild` through Vite was cleared by upgrading to Vite 6).
- **A07 — Identification failures**: the API is anonymous by design (a local
  single-user dev tool) and relies on rate limiting to blunt abuse.
- **A08 — Software integrity**: dependencies are locked in `package-lock.json`
  and scripts run through `allowScripts` so install scripts stay explicit.
- **A09 — Logging failures**: logs carry model failures and request errors
  only — never the API key or the submitted code.
- **A10 — SSRF**: the server only calls `api.groq.com` through the official
  SDK; no user-supplied URL is ever fetched.

Client side, the editor enforces `maxLength="20000"` so oversized payloads are
rejected before they leave the browser.

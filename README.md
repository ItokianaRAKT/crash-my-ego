# 💥 CrashMyEgo

A **passive-aggressive code reviewer** dressed up as a premium dark dashboard.
Paste your code, hit the button, and let a cynical diagnostic tell you exactly
what it thinks of your work.

## ✨ Features

- 🌌 Deep zinc dark mode (`#09090b`) with soft indigo/purple ambient glows
- 📝 Editor card: line-number gutter synced with the textarea, live
  `Ln/Col` status bar and `Ctrl + Enter` submission
- 🚀 Gradient **Review Code** action button (indigo → purple)
- 💀 Insights card where the verdict animates in — framed as a rose-tinted
  system diagnostic (`0x0000F41L`) instead of a crude popup
- ⏳ Loading skeleton with a shimmer effect while the reviewer judges you
- 🔌 Works with a real `POST /api/review` backend **or** falls back to a
  built-in local review generator, so the app is usable out of the box

## 🛠️ Stack

- React 18 (functional components + hooks)
- TypeScript (strict, no `any`)
- Tailwind CSS (custom `canvas`/`surface` tokens, keyframe animations)
- Fonts via Google Fonts CDN: **Inter** for the UI, **JetBrains Mono** for code
- Icons: hand-drawn inline SVG — no icon package to install

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

### Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Vite dev server                |
| `npm run build`    | Type-check and build for production      |
| `npm run preview`  | Preview the production build             |
| `npm run typecheck`| Run the TypeScript compiler only         |

## 🧩 Components

| File                                | Responsibility                                       |
| ----------------------------------- | ---------------------------------------------------- |
| `src/App.tsx`                       | Dashboard shell (header, grid, footer) + async review submission |
| `src/types.ts`                      | Shared interfaces, card props and API state union    |
| `src/api/reviewApi.ts`              | `POST /api/review` with local fallback               |
| `src/components/EditorCard.tsx`     | Code workspace: gutter, textarea, gradient button    |
| `src/components/InsightsCard.tsx`   | Idle / loading / rose verdict states of the feedback |
| `src/components/icons/ModernIcons.tsx` | Hand-drawn stroke SVG icon set                    |
| `src/index.css`                     | Dark base, scrollbar, card, gradient button, skeleton |

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

If the endpoint is unreachable, `reviewApi.ts` answers with a locally
generated cynical review so the Insights card still fills up.

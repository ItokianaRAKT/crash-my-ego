# 💥 CrashMyEgo

A **passive-aggressive code reviewer** dressed up as a clinical, monochrome
code terminal. Paste your code, hit the button, and let a cynical verdict fade
in over a blurred editor.

## ✨ Features

- ⚛️ "Laboratory monochrome" theme: pure `#0a0a0a` background, white primary
  text, muted zinc secondary text, hairline `zinc-900` borders — zero accents
- 📝 Editor as the center of attention: full-width card, line-number gutter
  synced with the textarea, live `Ln/Col` status bar, `Ctrl + Enter` submit
- ⚪ Solid white **Review Code** action button (`bg-white text-black`)
- 🌫️ Core effect: the review never lands in a box — a full-container
  `backdrop-blur-md` overlay (`bg-black/60`) blurs and locks the editor while
  the punchline fades into the center in large white text
- 🔗 Minimalist **Fix my code** link dismisses the blur and unlocks the editor
- 🔌 Works with a real `POST /api/review` backend **or** falls back to a
  built-in local review generator, so the app is usable out of the box

## 🛠️ Stack

- React 18 (functional components + hooks)
- TypeScript (strict, no `any`)
- Tailwind CSS (fade-in / shimmer keyframes, no custom color tokens)
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
| `src/App.tsx`                       | Page shell, review state machine and overlay wiring  |
| `src/types.ts`                      | Shared interfaces, card props and API state union    |
| `src/api/reviewApi.ts`              | `POST /api/review` with local fallback               |
| `src/components/EditorCard.tsx`     | Code workspace: gutter, textarea, white action button |
| `src/components/PunchlineOverlay.tsx` | Blurred overlay with the loading state and punchline |
| `src/components/icons/ModernIcons.tsx` | Hand-drawn stroke SVG icon set                    |
| `src/index.css`                     | Monochrome base, selection and scrollbars            |

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
generated cynical review so the overlay still delivers the punchline.

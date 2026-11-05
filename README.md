# 💥 CrashMyEgo

A **passive-aggressive code reviewer** dressed up as a Windows 95 desktop.
Paste your code, hit the button, and let a cynical fatal-error popup tell you
exactly what it thinks of your work.

## ✨ Features

- 🖥️ Window-only layout: the `CrashMyEgo - Revue de code.exe` window fills the
  viewport above the taskbar (classic `#008080` teal shell, 3D bevels, title bar gradients)
- 📝 Code editor window with sunken inset textarea
- 💀 Fatal error popup (`0x0000F41L`) that delivers the review
- 🕹️ Taskbar with a live clock ticking every second
- 🔌 Works with a real `POST /api/review` backend **or** falls back to a
  built-in local review generator, so the app is usable out of the box

## 🛠️ Stack

- React 18 (functional components + hooks)
- TypeScript (strict, no `any`)
- Tailwind CSS (custom `win95-*` bevel tokens)
- Icons: hand-drawn inline SVG in the classic Windows 95 style — no icon
  package to install

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

| File                          | Responsibility                                          |
| ----------------------------- | ------------------------------------------------------- |
| `src/App.tsx`                 | Global state + async review submission                  |
| `src/types.ts`                | Shared interfaces and API state union                   |
| `src/api/reviewApi.ts`        | `POST /api/review` with local fallback                  |
| `src/components/TitleBar.tsx` | Reusable window title bar (blue / red variants)         |
| `src/components/MainWindow.tsx` | Editor window with textarea and status bar action   |
| `src/components/ErrorPopup.tsx` | Modal fatal error box displaying the review            |
| `src/components/Taskbar.tsx`  | Bottom taskbar with task button and live clock          |
| `src/components/icons/RetroIcons.tsx` | Hand-drawn Windows 95 style SVG icons         |

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
generated cynical review so the popup still works.

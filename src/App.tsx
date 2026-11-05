import { useCallback, useState } from 'react';
import {
  isApiErrorMessage,
  readReviewMessage,
  requestCodeReview,
} from './api/reviewApi';
import { EditorCard } from './components/EditorCard';
import { PunchlineOverlay } from './components/PunchlineOverlay';
import type { ReviewStatus } from './types';

export default function App(): JSX.Element {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [isSystemError, setIsSystemError] = useState<boolean>(false);

  const isLoading = status === 'loading';
  const isOverlayOpen = status !== 'idle';

  const handleCodeChange = useCallback((nextCode: string): void => {
    setCode(nextCode);
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (code.trim().length === 0 || status === 'loading') {
      return;
    }

    setStatus('loading');

    try {
      const response = await requestCodeReview({ code });
      const failedRequest = isApiErrorMessage(response);

      setReviewResult(readReviewMessage(response));
      setIsSystemError(failedRequest);
      setStatus(failedRequest ? 'error' : 'success');
    } catch (error: unknown) {
      const fallbackMessage =
        error instanceof Error ? error.message : 'Erreur inconnue du reviewer.';

      setReviewResult(fallbackMessage);
      setIsSystemError(true);
      setStatus('error');
    }
  }, [code, status]);

  const handleDismiss = useCallback((): void => {
    setStatus('idle');
    setReviewResult(null);
    setIsSystemError(false);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a] text-white">
      <header className="border-b border-zinc-900">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white font-mono text-[13px] leading-none font-bold text-black">
              !
            </span>
            <span className="text-[13px] font-semibold tracking-tight text-white">
              CrashMyEgo
            </span>
            <span className="hidden font-mono text-[11px] text-zinc-600 sm:inline">
              v0.1.0
            </span>
          </div>

        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-6 py-6">
        <div className="mb-6 flex flex-col gap-2">
          <p className="font-mono text-[11px] tracking-[0.3em] text-zinc-500 uppercase">
            Terminal de revue de code
          </p>
          <h1 className="max-w-2xl text-xl leading-tight font-medium tracking-tight text-white sm:text-2xl">
            Collez votre code. Obtenez exactement ce qu'il en pense.
          </h1>
        </div>

        <div className="relative min-h-0 flex-1">
          <EditorCard
            code={code}
            onChange={handleCodeChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isBlurred={isOverlayOpen}
          />

          {isOverlayOpen ? (
            <PunchlineOverlay
              status={status}
              message={reviewResult}
              isSystemError={isSystemError}
              onDismiss={handleDismiss}
            />
          ) : null}
        </div>
      </main>

      <footer className="shrink-0 border-t border-zinc-900">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-4 font-mono text-[11px] text-zinc-600">
          <span>CrashMyEgo — votre code a appelé, il veut un avocat.</span>
        </div>
      </footer>
    </div>
  );
}

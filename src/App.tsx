import { useCallback, useState } from 'react';
import {
  isApiErrorMessage,
  readReviewMessage,
  requestCodeReview,
} from './api/reviewApi';
import { EditorCard } from './components/EditorCard';
import { PunchlineOverlay } from './components/PunchlineOverlay';
import { TerminalIcon } from './components/icons/ModernIcons';
import type { ReviewStatus } from './types';
import { CRASH_ERROR_CODE } from './types';

interface HeaderStatusMeta {
  label: string;
}

const HEADER_STATUS: Record<ReviewStatus, HeaderStatusMeta> = {
  idle: { label: 'Ready' },
  loading: { label: 'Reviewing' },
  success: { label: 'Complete' },
  error: { label: 'Failed' },
};

export default function App(): JSX.Element {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [isSystemError, setIsSystemError] = useState<boolean>(false);

  const isLoading = status === 'loading';
  const isOverlayOpen = status !== 'idle';
  const headerStatus = HEADER_STATUS[status];

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
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
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

          <div className="flex shrink-0 items-center gap-5">
            <span className="font-mono text-[11px] tracking-[0.16em] text-zinc-500 uppercase">
              {headerStatus.label}
            </span>
            <span className="hidden items-center gap-2 font-mono text-[11px] text-zinc-600 md:flex">
              <TerminalIcon className="h-3.5 w-3.5" />
              POST /api/review
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-3">
          <p className="font-mono text-[11px] tracking-[0.3em] text-zinc-500 uppercase">
            Code review terminal
          </p>
          <h1 className="max-w-2xl text-2xl leading-tight font-medium tracking-tight text-white sm:text-3xl">
            Paste your code. Get told exactly what it thinks of it.
          </h1>
        </div>

        <div className="relative">
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

      <footer className="border-t border-zinc-900">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-4 font-mono text-[11px] text-zinc-600">
          <span>CrashMyEgo — your code called, it wants a lawyer.</span>
          <span>{CRASH_ERROR_CODE}</span>
        </div>
      </footer>
    </div>
  );
}

import { useCallback, useState } from 'react';
import {
  isApiErrorMessage,
  readReviewMessage,
  requestCodeReview,
} from './api/reviewApi';
import { EditorCard } from './components/EditorCard';
import { InsightsCard } from './components/InsightsCard';
import { TerminalIcon } from './components/icons/ModernIcons';
import type { ReviewStatus } from './types';

interface HeaderStatusMeta {
  label: string;
  dotClassName: string;
}

const HEADER_STATUS: Record<ReviewStatus, HeaderStatusMeta> = {
  idle: { label: 'Ready', dotClassName: 'bg-zinc-500' },
  loading: { label: 'Reviewing', dotClassName: 'bg-indigo-400 animate-pulse-dot' },
  success: { label: 'Complete', dotClassName: 'bg-emerald-400' },
  error: { label: 'Error', dotClassName: 'bg-rose-400' },
};

export default function App(): JSX.Element {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [isSystemError, setIsSystemError] = useState<boolean>(false);

  const isLoading = status === 'loading';
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

  return (
    <div className="relative min-h-screen bg-canvas text-zinc-200">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(80%_50%_at_50%_-10%,rgba(99,102,241,0.18),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(55%_40%_at_100%_0%,rgba(168,85,247,0.10),transparent_55%)]"
      />

      <header className="relative border-b border-zinc-800/80 bg-canvas/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-base font-bold text-white shadow-lg shadow-indigo-500/25">
              !
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                CrashMyEgo
                <span className="hidden rounded-md border border-zinc-800 bg-zinc-900/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-500 sm:inline">
                  v0.1.0
                </span>
              </p>
              <p className="truncate text-xs text-zinc-500">
                Passive-aggressive code review
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400">
              <span className={`h-1.5 w-1.5 rounded-full ${headerStatus.dotClassName}`} />
              {headerStatus.label}
            </span>
            <span className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-500 md:inline-flex">
              <TerminalIcon className="h-3.5 w-3.5" />
              <span className="font-mono">POST /api/review</span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        <EditorCard
          code={code}
          onChange={handleCodeChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <InsightsCard
          status={status}
          message={reviewResult}
          isSystemError={isSystemError}
        />
      </main>

      <footer className="relative mx-auto max-w-7xl px-4 pb-8 text-center text-[11px] text-zinc-600 sm:px-6">
        CrashMyEgo — your code called, it wants a lawyer.
      </footer>
    </div>
  );
}

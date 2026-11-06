import type { InsightsCardProps, ReviewStatus } from '../types';
import { CRASH_ERROR_CODE } from '../types';
import {
  AlertTriangleIcon,
  CheckIcon,
  InboxIcon,
  SparkleIcon,
} from './icons/ModernIcons';

interface StatusMeta {
  label: string;
  dotClassName: string;
}

const STATUS_META: Record<ReviewStatus, StatusMeta> = {
  idle: { label: 'Idle', dotClassName: 'bg-zinc-500' },
  loading: { label: 'Running', dotClassName: 'bg-indigo-400 animate-pulse-dot' },
  success: { label: 'Done', dotClassName: 'bg-emerald-400' },
  error: { label: 'Failed', dotClassName: 'bg-rose-400' },
};

export function InsightsCard({
  status,
  message,
  isSystemError,
}: InsightsCardProps): JSX.Element {
  const statusMeta = STATUS_META[status];
  const charactersAnalyzed = message?.length ?? 0;

  return (
    <section className="card flex min-h-[320px] min-w-0 flex-col overflow-hidden lg:min-h-[560px]">
      <header className="card-header flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70 text-purple-400">
            <SparkleIcon className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">Insights</h2>
            <p className="truncate text-xs text-zinc-500">
              Passive-aggressive diagnostics
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClassName}`} />
          {statusMeta.label}
        </span>
      </header>

      {status === 'idle' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-500">
            <InboxIcon className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-zinc-300">No insights yet</p>
          <p className="max-w-[38ch] text-xs leading-relaxed text-zinc-500">
            Submit your code and the reviewer will tell you exactly what it
            thinks of it — without sugar coating anything.
          </p>
        </div>
      ) : null}

      {status === 'loading' ? (
        <div className="flex flex-1 flex-col gap-4 px-5 py-6">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-indigo-400/40 border-t-indigo-200 animate-spin" />
            Calcul du mépris...
          </div>
          <div className="skeleton-bar h-3.5 w-3/4" />
          <div className="skeleton-bar h-3.5 w-full" />
          <div className="skeleton-bar h-3.5 w-5/6" />
          <div className="skeleton-bar h-3.5 w-1/2" />
          <div className="skeleton-bar h-3.5 w-2/3" />
        </div>
      ) : null}

      {status === 'success' || status === 'error' ? (
        <div className="flex flex-1 flex-col gap-4 px-5 py-5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wider text-rose-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse-dot" />
              {isSystemError ? 'System diagnostic' : 'Review verdict'}
            </span>
            <code className="rounded-md border border-rose-900/50 bg-rose-950/40 px-2 py-0.5 font-mono text-[11px] text-rose-400">
              {CRASH_ERROR_CODE}
            </code>
          </div>

          <article
            key={`${status}-${message ?? ''}`}
            className="animate-fade-in-up rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 shadow-[0_0_40px_-16px_rgba(244,63,94,0.45)]"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-rose-400">
                {isSystemError ? (
                  <AlertTriangleIcon className="h-4 w-4" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
              </span>
              <p className="min-w-0 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-rose-300">
                {message}
              </p>
            </div>
          </article>

          <div className="mt-auto flex items-center justify-between gap-3 text-[11px] text-zinc-600">
            <span>Reviewed just now</span>
            <span className="font-mono">{charactersAnalyzed} chars analyzed</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}

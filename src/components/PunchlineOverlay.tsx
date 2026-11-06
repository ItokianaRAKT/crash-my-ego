import type { PunchlineOverlayProps } from '../types';
import { CRASH_ERROR_CODE } from '../types';

export function PunchlineOverlay({
  status,
  message,
  isSystemError,
  onDismiss,
}: PunchlineOverlayProps): JSX.Element {
  const isLoading = status === 'loading';

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-7 bg-black/60 px-8 text-center backdrop-blur-md"
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-5 animate-fade-in">
          <div className="h-px w-40 overflow-hidden bg-zinc-800">
            <div className="h-full w-1/2 bg-white animate-shimmer" />
          </div>
          <p className="text-[11px] tracking-[0.34em] text-zinc-400 uppercase">
            Calcul du mépris...
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-7">
          <p className="text-[11px] tracking-[0.34em] text-zinc-500 uppercase animate-fade-in">
            {isSystemError ? 'System diagnostic' : 'Verdict'}
            <span className="ml-3 text-zinc-700">{CRASH_ERROR_CODE}</span>
          </p>

          <p className="max-w-3xl text-2xl leading-[1.35] font-medium text-white break-words text-balance animate-fade-in-slow sm:text-3xl">
            {message}
          </p>

          <button
            type="button"
            onClick={onDismiss}
            className="text-[13px] tracking-[0.16em] text-zinc-400 uppercase underline-offset-8 transition hover:text-white hover:underline animate-fade-in-slow"
          >
            Fix my code
          </button>
        </div>
      )}
    </div>
  );
}

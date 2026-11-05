import { useCallback, useEffect, type MouseEvent } from 'react';
import type { ErrorPopupProps } from '../types';
import { CRASH_ERROR_CODE } from '../types';
import { TitleBar } from './TitleBar';
import { CriticalStopIcon } from './icons/RetroIcons';

export function ErrorPopup({
  isOpen,
  onClose,
  message,
  isSystemError,
}: ErrorPopupProps): JSX.Element | null {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDivElement>): void => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleDialogClick = useCallback((event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  }, []);

  if (!isOpen) {
    return null;
  }

  const summaryText = isSystemError
    ? `Une panne système de type ${CRASH_ERROR_CODE} a été détectée :`
    : `Une abomination de type ${CRASH_ERROR_CODE} a été détectée :`;

  const windowTitle = isSystemError
    ? 'CrashMyEgo - Erreur système'
    : 'CrashMyEgo - Avertissement grave';

  return (
    <div
      role="presentation"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crash-popup-title"
        onClick={handleDialogClick}
        className="win95-raised flex w-full max-w-[520px] flex-col bg-[#c0c0c0] p-[3px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.45)]"
      >
        <TitleBar
          title={windowTitle}
          variant="error"
          onClose={onClose}
          showWindowControls
        />

        <div className="flex items-start gap-4 px-4 pt-4">
          <CriticalStopIcon className="h-[52px] w-[52px] shrink-0" />

          <div className="min-w-0 pt-1">
            <p
              id="crash-popup-title"
              className="text-[13px] leading-[18px] font-bold text-black"
            >
              {summaryText}
            </p>
            <p className="mt-1 text-[11px] leading-[15px] text-[#404040]">
              {isSystemError
                ? 'Le reviewer a rencontré un problème et a choisi de ne rien comprendre.'
                : 'Le verdict du reviewer est prêt. Vous n’allez pas aimer.'}
            </p>
          </div>
        </div>

        <div className="px-4 pt-3 pb-1">
          <div
            aria-label="Contenu de la revue"
            className="win95-sunken max-h-[220px] min-h-[96px] overflow-auto bg-white p-3 font-mono text-[13px] leading-[19px] whitespace-pre-wrap text-black shadow-[inset_2px_2px_0px_#000]"
          >
            {message}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-3">
          <p className="truncate text-[10px] text-[#404040]">
            Code : {CRASH_ERROR_CODE}
          </p>

          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="win95-button min-w-[86px] font-bold"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

import { useCallback } from 'react';
import { playMouseClick } from '../audio/mouseClick';
import type { TitleBarProps } from '../types';

/**
 * Windows 95 style title bar.
 *
 * The three window controls are real buttons: each one plays a mechanical
 * mouse click. The ✕ control additionally runs `onClose` when provided.
 */
export function TitleBar({
  title,
  variant,
  onClose,
  showWindowControls = true,
}: TitleBarProps): JSX.Element {
  const gradientClass = variant === 'error' ? 'win95-titlebar-error' : 'win95-titlebar';
  const controlClasses =
    'win95-raised-thin flex h-[16px] w-[16px] items-center justify-center bg-[#c0c0c0] leading-none text-black active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white';

  const handleMinimizeClick = useCallback((): void => {
    playMouseClick();
  }, []);

  const handleMaximizeClick = useCallback((): void => {
    playMouseClick();
  }, []);

  const handleCloseClick = useCallback((): void => {
    playMouseClick();
    onClose?.();
  }, [onClose]);

  return (
    <div
      className={`${gradientClass} flex h-[18px] items-center justify-between px-[3px] text-[11px] font-bold text-white select-none`}
    >
      <span className="truncate pl-[2px]">{title}</span>

      {showWindowControls ? (
        <div className="flex shrink-0 items-center gap-[2px]">
          <button
            type="button"
            aria-label="Réduire la fenêtre"
            title="Réduire"
            onClick={handleMinimizeClick}
            className={`${controlClasses} pb-[2px] text-[11px]`}
          >
            ▁
          </button>

          <button
            type="button"
            aria-label="Agrandir la fenêtre"
            title="Agrandir"
            onClick={handleMaximizeClick}
            className={`${controlClasses} text-[10px]`}
          >
            ▢
          </button>

          <button
            type="button"
            aria-label="Fermer la fenêtre"
            title="Fermer"
            onClick={handleCloseClick}
            className={`${controlClasses} text-[11px]`}
          >
            ✕
          </button>
        </div>
      ) : null}
    </div>
  );
}

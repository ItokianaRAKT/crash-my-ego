import type { TitleBarProps } from '../types';

/**
 * Windows 95 style title bar.
 *
 * When `onClose` is provided the ✕ control is a real button. Without it the
 * three controls stay purely decorative spans: they keep the retro look but
 * can never receive focus, so we never ship a button that pretends to work.
 */
export function TitleBar({
  title,
  variant,
  onClose,
  showWindowControls = true,
}: TitleBarProps): JSX.Element {
  const gradientClass = variant === 'error' ? 'win95-titlebar-error' : 'win95-titlebar';
  const controlClasses =
    'win95-raised-thin flex h-[16px] w-[16px] items-center justify-center bg-[#c0c0c0] leading-none text-black';

  return (
    <div
      className={`${gradientClass} flex h-[18px] items-center justify-between px-[3px] text-[11px] font-bold text-white select-none`}
    >
      <span className="truncate pl-[2px]">{title}</span>

      {showWindowControls ? (
        <div className="flex shrink-0 items-center gap-[2px]">
          <span aria-hidden="true" className={`${controlClasses} pb-[2px] text-[11px]`}>
            ▁
          </span>
          <span aria-hidden="true" className={`${controlClasses} text-[10px]`}>
            ▢
          </span>

          {onClose ? (
            <button
              type="button"
              aria-label="Fermer la fenêtre"
              onClick={onClose}
              className={`${controlClasses} text-[11px] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white`}
            >
              ✕
            </button>
          ) : (
            <span aria-hidden="true" className={`${controlClasses} text-[11px]`}>
              ✕
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}

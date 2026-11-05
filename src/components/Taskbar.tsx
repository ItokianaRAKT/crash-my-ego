import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import type { TaskbarProps } from '../types';
import { ComputerIcon, SpeakerIcon } from './icons/RetroIcons';
import { VolumeSlider } from './VolumeSlider';

/** Pad a number so the clock always shows two digits. */
function padToTwoDigits(value: number): string {
  return value.toString().padStart(2, '0');
}

/** Format a date as a Win95 clock: HH:MM:SS. */
function formatClock(now: Date): string {
  return [
    padToTwoDigits(now.getHours()),
    padToTwoDigits(now.getMinutes()),
    padToTwoDigits(now.getSeconds()),
  ].join(':');
}

/**
 * Bottom taskbar: a pressed task button showing the focused window and a
 * system tray holding the volume slider and a live clock refreshed every
 * second.
 */
export function Taskbar({
  activeWindowTitle,
  volume,
  onVolumeChange,
}: TaskbarProps): JSX.Element {
  const [currentTime, setCurrentTime] = useState<string>(() => formatClock(new Date()));
  const [isVolumePanelOpen, setIsVolumePanelOpen] = useState<boolean>(false);

  // Tick the clock once per second for the whole lifetime of the taskbar.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(formatClock(new Date()));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // Close the volume panel on outside click or Escape.
  useEffect(() => {
    if (!isVolumePanelOpen) {
      return undefined;
    }

    const handleDocumentClick = (): void => {
      setIsVolumePanelOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsVolumePanelOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVolumePanelOpen]);

  const toggleVolumePanel = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    // Keep the document listener from closing the panel right after opening.
    event.stopPropagation();
    setIsVolumePanelOpen((isOpen) => !isOpen);
  }, []);

  return (
    <footer
      aria-label="Barre des tâches"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[30px] items-center gap-2 bg-[#c0c0c0] px-[3px] pb-[2px] shadow-[inset_0_3px_0_0_#808080,inset_0_2px_0_0_#ffffff]"
    >
      {/* Focused window button (indicator, not a control) */}
      <div
        aria-label={`Fenêtre active : ${activeWindowTitle}`}
        className="win95-sunken-thin flex h-[24px] min-w-0 flex-1 items-center gap-2 bg-[#c0c0c0] px-[6px] py-[2px] text-left text-[11px] font-bold shadow-[inset_1px_1px_0px_0px_#000000,inset_-1px_-1px_0px_0px_#dfdfdf]"
      >
        <span className="flex w-[16px] justify-center">
          <ComputerIcon className="h-[14px] w-[14px]" />
        </span>
        <span className="truncate">{activeWindowTitle}</span>
      </div>

      {/* System tray: volume control + live clock */}
      <div
        aria-label="Zone de notification"
        className="win95-sunken-thin relative flex h-[24px] shrink-0 items-center gap-[6px] bg-[#c0c0c0] px-[6px] py-[2px]"
      >
        <button
          type="button"
          onClick={toggleVolumePanel}
          aria-expanded={isVolumePanelOpen}
          aria-label="Ouvrir le réglage du volume"
          title="Volume"
          className="flex h-[18px] w-[18px] items-center justify-center"
          data-pressed={isVolumePanelOpen}
        >
          <SpeakerIcon className="h-[13px] w-[13px]" />
        </button>

        {isVolumePanelOpen ? (
          <VolumeSlider
            volume={volume}
            onVolumeChange={onVolumeChange}
            onClose={() => setIsVolumePanelOpen(false)}
          />
        ) : null}

        <time
          dateTime={new Date().toISOString()}
          aria-label={`Heure actuelle : ${currentTime}`}
          className="text-[11px] tabular-nums text-black"
        >
          {currentTime}
        </time>
      </div>
    </footer>
  );
}

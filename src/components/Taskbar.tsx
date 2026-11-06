import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import type { TaskbarProps } from '../types';
import { ComputerIcon, SpeakerIcon } from './icons/RetroIcons';
import { VolumeSlider } from './VolumeSlider';

function padToTwoDigits(value: number): string {
  return value.toString().padStart(2, '0');
}

function formatClock(now: Date): string {
  return [
    padToTwoDigits(now.getHours()),
    padToTwoDigits(now.getMinutes()),
    padToTwoDigits(now.getSeconds()),
  ].join(':');
}

export function Taskbar({
  activeWindowTitle,
  volume,
  onVolumeChange,
}: TaskbarProps): JSX.Element {
  const [currentTime, setCurrentTime] = useState<string>(() => formatClock(new Date()));
  const [isVolumePanelOpen, setIsVolumePanelOpen] = useState<boolean>(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(formatClock(new Date()));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

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
    event.stopPropagation();
    setIsVolumePanelOpen((isOpen) => !isOpen);
  }, []);

  return (
    <footer
      aria-label="Barre des tâches"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[30px] items-center gap-2 bg-[#c0c0c0] px-[3px] pb-[2px] shadow-[inset_0_3px_0_0_#808080,inset_0_2px_0_0_#ffffff]"
    >
      <div
        aria-label={`Fenêtre active : ${activeWindowTitle}`}
        className="win95-sunken-thin flex h-[24px] min-w-0 flex-1 items-center gap-2 bg-[#c0c0c0] px-[6px] py-[2px] text-left text-[11px] font-bold shadow-[inset_1px_1px_0px_0px_#000000,inset_-1px_-1px_0px_0px_#dfdfdf]"
      >
        <span className="flex w-[16px] justify-center">
          <ComputerIcon className="h-[14px] w-[14px]" />
        </span>
        <span className="truncate">{activeWindowTitle}</span>
      </div>

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

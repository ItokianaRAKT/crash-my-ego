import { useEffect, useState } from 'react';
import type { TaskbarProps } from '../types';
import { ComputerIcon, SpeakerIcon } from './icons/RetroIcons';

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
 * system tray with a live clock that refreshes every second.
 */
export function Taskbar({ activeWindowTitle }: TaskbarProps): JSX.Element {
  const [currentTime, setCurrentTime] = useState<string>(() => formatClock(new Date()));

  // Tick the clock once per second for the whole lifetime of the taskbar.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(formatClock(new Date()));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
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

      {/* System tray: sound icon + live clock */}
      <div
        aria-label="Zone de notification"
        className="win95-sunken-thin flex h-[24px] shrink-0 items-center gap-[6px] bg-[#c0c0c0] px-[6px] py-[2px]"
      >
        <span aria-hidden="true" title="Volume" className="flex">
          <SpeakerIcon className="h-[13px] w-[13px]" />
        </span>
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

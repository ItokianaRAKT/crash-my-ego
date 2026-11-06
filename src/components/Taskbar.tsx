import { useCallback, useEffect, useState, type ComponentType, type MouseEvent } from 'react';
import type { TaskbarProps } from '../types';
import type { RetroIconProps } from './icons/RetroIcons';
import {
  AppWindowIcon,
  ComputerIcon,
  FolderIcon,
  HelpIcon,
  PowerIcon,
  SettingsIcon,
  SpeakerIcon,
  WindowsFlagIcon,
} from './icons/RetroIcons';

/** Entries of the mock Start menu — decorative, like the app menu strip. */
interface StartMenuEntry {
  icon: ComponentType<RetroIconProps>;
  label: string;
}

const START_MENU_ENTRIES: readonly StartMenuEntry[] = [
  { icon: FolderIcon, label: 'Programmes' },
  { icon: AppWindowIcon, label: 'CrashMyEgo' },
  { icon: SettingsIcon, label: 'Paramètres' },
  { icon: HelpIcon, label: 'Aide' },
  { icon: PowerIcon, label: 'Éteindre l’ordinateur…' },
];

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
 * Bottom taskbar: Start button with a collapsible mock menu, a pressed task
 * button showing the focused window and a system tray with a live clock that
 * refreshes every second.
 */
export function Taskbar({ activeWindowTitle }: TaskbarProps): JSX.Element {
  const [currentTime, setCurrentTime] = useState<string>(() => formatClock(new Date()));
  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(false);

  // Tick the clock once per second for the whole lifetime of the taskbar.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(formatClock(new Date()));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // Close the Start menu on outside click or Escape.
  useEffect(() => {
    if (!isStartMenuOpen) {
      return undefined;
    }

    const handleDocumentClick = (): void => {
      setIsStartMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsStartMenuOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStartMenuOpen]);

  const toggleStartMenu = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    // Stop the document listener from closing the menu right after opening it.
    event.stopPropagation();
    setIsStartMenuOpen((isOpen) => !isOpen);
  }, []);

  return (
    <footer
      aria-label="Barre des tâches"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[30px] items-center gap-2 bg-[#c0c0c0] px-[3px] pb-[2px] shadow-[inset_0_3px_0_0_#808080,inset_0_2px_0_0_#ffffff]"
    >
      {/* Start button + mock menu */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={toggleStartMenu}
          aria-expanded={isStartMenuOpen}
          className="win95-button flex h-[24px] items-center gap-[4px] px-[6px] font-bold"
          data-pressed={isStartMenuOpen}
          title="Start"
        >
          <WindowsFlagIcon className="h-[15px] w-[15px]" />
          Démarrer
        </button>

        {isStartMenuOpen ? (
          <div
            role="menu"
            aria-label="Menu Démarrer"
            onClick={(event) => event.stopPropagation()}
            className="win95-raised absolute bottom-[100%] left-0 mb-[4px] flex w-[220px] bg-[#c0c0c0] p-[2px]"
          >
            {/* Vertical navy banner, like the real Windows 95 Start menu */}
            <div className="flex w-[26px] shrink-0 items-end justify-center bg-gradient-to-b from-[#000080] to-[#1084d0] py-[6px]">
              <span className="rotate-180 text-[11px] font-bold whitespace-nowrap text-white [writing-mode:vertical-rl]">
                CrashMyEgo95
              </span>
            </div>

            <ul className="flex-1 py-[2px]">
              {START_MENU_ENTRIES.map(({ icon: EntryIcon, label }) => (
                <li key={label}>
                  <span className="flex cursor-default items-center gap-2 px-[8px] py-[5px] text-[12px] text-black hover:bg-[#000080] hover:text-white">
                    <span aria-hidden="true" className="flex w-[16px] justify-center">
                      <EntryIcon className="h-[14px] w-[14px]" />
                    </span>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

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

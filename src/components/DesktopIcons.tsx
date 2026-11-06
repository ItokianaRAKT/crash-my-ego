import { useCallback, useState } from 'react';

/** A single desktop shortcut. */
export interface DesktopShortcut {
  id: string;
  icon: string;
  label: string;
}

/** Default shortcuts drawn on the teal desktop. */
const DESKTOP_SHORTCUTS: readonly DesktopShortcut[] = [
  { id: 'my-computer', icon: '💻', label: 'Poste de travail' },
  { id: 'crash-my-ego', icon: '💥', label: 'CrashMyEgo' },
  { id: 'notepad', icon: '📝', label: 'brouillon.txt' },
  { id: 'recycle-bin', icon: '🗑️', label: 'Corbeille' },
];

/**
 * Column of Windows 95 desktop shortcuts.
 * Clicking an icon selects it (the classic dotted focus frame), clicking the
 * desktop again clears the selection — no fake "open" behaviour.
 */
export function DesktopIcons(): JSX.Element {
  const [selectedShortcutId, setSelectedShortcutId] = useState<string | null>(null);

  const handleSelect = useCallback((shortcutId: string): void => {
    setSelectedShortcutId((currentId) => (currentId === shortcutId ? null : shortcutId));
  }, []);

  const handleDesktopClick = useCallback((): void => {
    setSelectedShortcutId(null);
  }, []);

  return (
    <div
      onMouseDown={handleDesktopClick}
      className="absolute inset-0 z-0 p-2"
      aria-label="Bureau"
    >
      <ul className="flex w-[84px] flex-col gap-2">
        {DESKTOP_SHORTCUTS.map((shortcut) => {
          const isSelected = selectedShortcutId === shortcut.id;

          return (
            <li key={shortcut.id} className="flex justify-center">
              <button
                type="button"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => handleSelect(shortcut.id)}
                aria-pressed={isSelected}
                className={`flex w-[76px] flex-col items-center gap-[2px] px-1 py-[3px] text-center ${
                  isSelected ? 'border border-dotted border-white bg-[#000080]' : 'border border-transparent'
                }`}
              >
                <span aria-hidden="true" className="text-[26px] leading-none drop-shadow-[1px_1px_0px_rgba(0,0,0,0.6)]">
                  {shortcut.icon}
                </span>
                <span
                  className="text-[11px] leading-[13px] text-white [text-shadow:1px_1px_0px_#000000]"
                >
                  {shortcut.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
